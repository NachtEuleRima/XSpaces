/**
 * Syncs live and scheduled X Spaces into the local database.
 * Called on-demand or periodically from route handlers.
 */

import { db, spacesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import {
  searchSpacesByState,
  getSpacesByCreatorIds,
  buildUserMap,
  upgradeAvatarUrl,
  type XSpace,
  type XUser,
  type XSpacesResponse,
} from "./x-api.js";

import { logger } from "./logger.js";

const OWNER_USER_ID = process.env["OWNER_X_USER_ID"] ?? "";

// How stale (in ms) synced data can be before we re-fetch
const SYNC_TTL_MS = 3 * 60 * 1000; // 3 minutes

let lastSyncAttempt = 0;
let syncInProgress = false;

export interface SyncResult {
  synced: number;
  markedEnded: number;
  error?: string;
}

/**
 * Map an X Space + user lookup to our DB insert shape.
 */
function mapSpaceToDb(
  xSpace: XSpace,
  userMap: Map<string, XUser>
): Omit<typeof spacesTable.$inferInsert, "id"> {
  const hostId = xSpace.host_ids?.[0] ?? xSpace.creator_id;
  const coHostIds = (xSpace.host_ids ?? []).slice(1);
  const speakerIds = xSpace.speaker_ids ?? [];

  const mapParticipant = (userId: string, role: "host" | "co-host" | "speaker") => {
    const user = userMap.get(userId);
    return {
      username: user?.username ?? userId,
      displayName: user?.name ?? userId,
      avatarUrl: upgradeAvatarUrl(user?.profile_image_url),
      role,
    };
  };

  const host = hostId ? mapParticipant(hostId, "host") : {
    username: "unknown",
    displayName: "Unknown Host",
    avatarUrl: null,
    role: "host" as const,
  };

  const coHosts = coHostIds.map(id => mapParticipant(id, "co-host"));
  const speakers = speakerIds.map(id => mapParticipant(id, "speaker"));

  const status: "live" | "upcoming" | "ended" =
    xSpace.state === "live" ? "live"
    : xSpace.state === "scheduled" ? "upcoming"
    : "ended";

  const spaceUrl = `https://twitter.com/i/spaces/${xSpace.id}`;

  return {
    xSpaceId: xSpace.id,
    title: xSpace.title ?? "Untitled Space",
    description: null,
    status,
    spaceUrl,
    scheduledAt: xSpace.scheduled_start ? new Date(xSpace.scheduled_start) : null,
    startedAt: xSpace.started_at ? new Date(xSpace.started_at) : null,
    listenerCount: xSpace.participant_count ?? 0,
    host,
    coHosts,
    speakers,
    topicTags: [],
    lastSyncedAt: new Date(),
  };
}

/**
 * Core sync logic — fetches both live and scheduled spaces from X API,
 * upserts into the DB, and marks spaces that are no longer live/scheduled as ended.
 */
export async function syncSpacesFromX(): Promise<SyncResult> {
  let synced = 0;
  let markedEnded = 0;

  try {
    // Fetch live, scheduled, and owner's own spaces in parallel
    const fetches: Promise<XSpacesResponse>[] = [
      searchSpacesByState("live"),
      searchSpacesByState("scheduled"),
    ];
    if (OWNER_USER_ID) {
      fetches.push(getSpacesByCreatorIds([OWNER_USER_ID]));
    }

    const [liveRes, scheduledRes, ownerRes = {}] = await Promise.all(fetches);

    // Deduplicate spaces by ID across all sources
    const seenSpaceIds = new Set<string>();
    const allSpaces: XSpace[] = [];
    for (const space of [
      ...(liveRes.data ?? []),
      ...(scheduledRes.data ?? []),
      ...(ownerRes.data ?? []),
    ]) {
      if (!seenSpaceIds.has(space.id)) {
        seenSpaceIds.add(space.id);
        allSpaces.push(space);
      }
    }

    // Merge user maps from all responses
    const allUsers = [
      ...(liveRes.includes?.users ?? []),
      ...(scheduledRes.includes?.users ?? []),
      ...(ownerRes.includes?.users ?? []),
    ];
    const userMap = buildUserMap(allUsers);

    const seenXIds: string[] = [];

    for (const xSpace of allSpaces) {
      const row = mapSpaceToDb(xSpace, userMap);
      seenXIds.push(xSpace.id);

      // Upsert: insert or update on x_space_id conflict
      await db
        .insert(spacesTable)
        .values(row as typeof spacesTable.$inferInsert)
        .onConflictDoUpdate({
          target: spacesTable.xSpaceId,
          set: {
            title: row.title,
            status: row.status,
            scheduledAt: row.scheduledAt,
            startedAt: row.startedAt,
            listenerCount: row.listenerCount,
            host: row.host,
            coHosts: row.coHosts,
            speakers: row.speakers,
            lastSyncedAt: row.lastSyncedAt,
          },
        });

      synced++;
    }

    // Mark any X-sourced spaces we didn't see as "ended"
    // (only if we have at least one result — avoids wiping on API error)
    if (seenXIds.length > 0) {
      const currentLiveOrUpcoming = await db
        .select({ id: spacesTable.id, xSpaceId: spacesTable.xSpaceId })
        .from(spacesTable)
        .where(inArray(spacesTable.status, ["live", "upcoming"]));

      const toEnd = currentLiveOrUpcoming.filter(
        s => s.xSpaceId !== null && !seenXIds.includes(s.xSpaceId!)
      );

      if (toEnd.length > 0) {
        await db
          .update(spacesTable)
          .set({ status: "ended", lastSyncedAt: new Date() })
          .where(inArray(spacesTable.id, toEnd.map(s => s.id)));
        markedEnded = toEnd.length;
      }
    }

    logger.info({ synced, markedEnded }, "X Spaces sync complete");
    return { synced, markedEnded };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "X Spaces sync failed");
    return { synced, markedEnded, error };
  }
}

/**
 * Throttled sync — only re-fetches from X API if TTL has expired
 * and no other sync is in progress.
 */
export async function syncIfStale(): Promise<void> {
  const now = Date.now();
  if (syncInProgress || now - lastSyncAttempt < SYNC_TTL_MS) return;

  syncInProgress = true;
  lastSyncAttempt = now;

  try {
    await syncSpacesFromX();
  } finally {
    syncInProgress = false;
  }
}
