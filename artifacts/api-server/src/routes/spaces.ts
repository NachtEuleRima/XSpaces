import { Router } from "express";
import { db, spacesTable } from "@workspace/db";
import { eq, desc, and, gt } from "drizzle-orm";
import { GetSpaceParams } from "@workspace/api-zod";
import { syncIfStale, syncSpacesFromX, getFollowingUsernamesCache } from "../lib/sync.js";
import { getViewerFollowing } from "../lib/viewer.js";

const router = Router();

const OWNER_USERNAME = (process.env["OWNER_X_USERNAME"] ?? "").toLowerCase();

type Participant = { username?: string };

function getParticipantUsernames(space: typeof spacesTable.$inferSelect): string[] {
  const host = space.host as Participant | null;
  const coHosts = space.coHosts as Participant[];
  const speakers = space.speakers as Participant[];
  return [host, ...coHosts, ...speakers]
    .filter(Boolean)
    .map(p => (p as Participant).username?.toLowerCase() ?? "")
    .filter(Boolean);
}

function isSpaceForFollowing(space: typeof spacesTable.$inferSelect, following: Set<string>, viewerUsername?: string): boolean {
  const usernames = getParticipantUsernames(space);
  if (viewerUsername && usernames.includes(viewerUsername.toLowerCase())) return true;
  if (!viewerUsername && OWNER_USERNAME && usernames.includes(OWNER_USERNAME)) return true;
  if (following.size === 0) return false;
  return usernames.some(u => following.has(u));
}

function formatSpace(space: typeof spacesTable.$inferSelect, following?: Set<string>, viewerUsername?: string) {
  const effectiveFollowing = following ?? getFollowingUsernamesCache();
  return {
    id: space.id,
    title: space.title,
    description: space.description ?? undefined,
    status: space.status,
    spaceUrl: space.spaceUrl,
    scheduledAt: space.scheduledAt?.toISOString() ?? null,
    startedAt: space.startedAt?.toISOString() ?? null,
    listenerCount: space.listenerCount,
    host: space.host,
    coHosts: space.coHosts,
    speakers: space.speakers,
    topicTags: space.topicTags,
    isMine: isSpaceForFollowing(space, effectiveFollowing, viewerUsername),
    createdAt: space.createdAt.toISOString(),
  };
}

// Trigger a non-blocking background sync before responding
async function withSync(fn: () => Promise<void>): Promise<void> {
  // Fire sync in background — don't await so response isn't delayed
  syncIfStale().catch(() => {});
  await fn();
}

router.get("/spaces", async (req, res) => {
  await withSync(async () => {
    const spaces = await db
      .select()
      .from(spacesTable)
      .orderBy(desc(spacesTable.createdAt));
    res.json(spaces.map(s => formatSpace(s)));
  });
});

router.get("/spaces/live", async (req, res) => {
  await withSync(async () => {
    const viewerUsername = typeof req.query["viewerUsername"] === "string" ? req.query["viewerUsername"] : undefined;
    // If viewerUsername given but lookup fails, use empty set — don't fall back to owner cache
    const viewerFollowing = viewerUsername ? (await getViewerFollowing(viewerUsername) ?? new Set<string>()) : undefined;

    const spaces = await db
      .select()
      .from(spacesTable)
      .where(eq(spacesTable.status, "live"))
      .orderBy(desc(spacesTable.listenerCount));
    res.json(spaces.map(s => formatSpace(s, viewerFollowing, viewerUsername)));
  });
});

router.get("/spaces/upcoming", async (req, res) => {
  await withSync(async () => {
    const viewerUsername = typeof req.query["viewerUsername"] === "string" ? req.query["viewerUsername"] : undefined;
    // If viewerUsername given but lookup fails, use empty set — don't fall back to owner cache
    const viewerFollowing = viewerUsername ? (await getViewerFollowing(viewerUsername) ?? new Set<string>()) : undefined;

    const spaces = await db
      .select()
      .from(spacesTable)
      .where(
        and(
          eq(spacesTable.status, "upcoming"),
          gt(spacesTable.scheduledAt, new Date())
        )
      )
      .orderBy(spacesTable.scheduledAt);
    res.json(spaces.map(s => formatSpace(s, viewerFollowing, viewerUsername)));
  });
});

router.get("/spaces/stats", async (req, res) => {
  const { visitorsTable } = await import("@workspace/db");
  const allSpaces = await db.select().from(spacesTable);
  const allVisitors = await db.select().from(visitorsTable);

  const liveCount = allSpaces.filter((s) => s.status === "live").length;
  const upcomingCount = allSpaces.filter((s) => s.status === "upcoming").length;
  const totalListeners = allSpaces.reduce((sum, s) => sum + s.listenerCount, 0);

  res.json({
    totalSpaces: allSpaces.length,
    liveCount,
    upcomingCount,
    totalListeners,
    totalVisitors: allVisitors.length,
  });
});

router.get("/spaces/:id", async (req, res) => {
  const parsed = GetSpaceParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid space id" });
    return;
  }
  const [space] = await db
    .select()
    .from(spacesTable)
    .where(eq(spacesTable.id, parsed.data.id));
  if (!space) {
    res.status(404).json({ error: "Space not found" });
    return;
  }
  res.json(formatSpace(space));
});

// Manual sync endpoint — triggers an immediate forced sync from X API
router.post("/sync", async (req, res) => {
  const result = await syncSpacesFromX();
  res.json(result);
});

export default router;
