/**
 * X (Twitter) API v2 client for fetching Spaces data.
 * Uses app-only Bearer Token authentication.
 */

const X_API_BASE = "https://api.twitter.com/2";

const SPACE_FIELDS = [
  "title",
  "state",
  "started_at",
  "scheduled_start",
  "participant_count",
  "creator_id",
  "host_ids",
  "speaker_ids",
  "invited_user_ids",
  "topic_ids",
  "lang",
].join(",");

const USER_FIELDS = [
  "username",
  "name",
  "profile_image_url",
  "description",
  "public_metrics",
].join(",");

const EXPANSIONS = [
  "creator_id",
  "host_ids",
  "speaker_ids",
  "invited_user_ids",
].join(",");

export interface XUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

export interface XSpace {
  id: string;
  title?: string;
  state: "live" | "scheduled" | "ended";
  started_at?: string;
  scheduled_start?: string;
  participant_count?: number;
  creator_id?: string;
  host_ids?: string[];
  speaker_ids?: string[];
  invited_user_ids?: string[];
  topic_ids?: string[];
  lang?: string;
}

export interface XSpacesResponse {
  data?: XSpace[];
  includes?: {
    users?: XUser[];
  };
  meta?: {
    result_count?: number;
    next_token?: string;
  };
  errors?: Array<{ message: string; title: string }>;
}

function getBearerToken(): string {
  const token = process.env["X_BEARER_TOKEN"];
  if (!token) throw new Error("X_BEARER_TOKEN environment variable is not set");
  return token;
}

async function xFetch(path: string): Promise<unknown> {
  const token = getBearerToken();
  const res = await fetch(`${X_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`X API error ${res.status}: ${body}`);
  }

  return res.json();
}

/**
 * Search for spaces by state (live or scheduled).
 * Runs several broad keyword searches in parallel and merges unique results
 * to maximize coverage since X requires a non-empty query string.
 * Note: Requires paid X API credits.
 */
export async function searchSpacesByState(
  state: "live" | "scheduled",
  maxResults = 25
): Promise<XSpacesResponse> {
  // Common words likely to appear in Space titles — spread across many topics
  const broadQueries = ["the", "a", "live", "talk", "crypto", "tech", "news", "politics"];

  const params = new URLSearchParams({
    state,
    max_results: String(Math.min(maxResults, 100)),
    "space.fields": SPACE_FIELDS,
    "user.fields": USER_FIELDS,
    expansions: EXPANSIONS,
  });

  // Run all queries in parallel, ignore individual failures
  const results = await Promise.allSettled(
    broadQueries.map(q =>
      xFetch(`/spaces/search?query=${encodeURIComponent(q)}&${params.toString()}`) as Promise<XSpacesResponse>
    )
  );

  // Merge and deduplicate by space ID
  const seenIds = new Set<string>();
  const mergedData: XSpace[] = [];
  const mergedUsers: XUser[] = [];
  const seenUserIds = new Set<string>();

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const res = result.value;

    for (const space of res.data ?? []) {
      if (!seenIds.has(space.id)) {
        seenIds.add(space.id);
        mergedData.push(space);
      }
    }
    for (const user of res.includes?.users ?? []) {
      if (!seenUserIds.has(user.id)) {
        seenUserIds.add(user.id);
        mergedUsers.push(user);
      }
    }
  }

  return {
    data: mergedData,
    includes: { users: mergedUsers },
    meta: { result_count: mergedData.length },
  };
}

/**
 * Look up spaces by their IDs.
 */
export async function getSpacesByIds(ids: string[]): Promise<XSpacesResponse> {
  if (ids.length === 0) return {};
  const params = new URLSearchParams({
    ids: ids.join(","),
    "space.fields": SPACE_FIELDS,
    "user.fields": USER_FIELDS,
    expansions: EXPANSIONS,
  });
  return xFetch(`/spaces?${params.toString()}`) as Promise<XSpacesResponse>;
}

/**
 * Get active spaces created by a specific user ID.
 */
export async function getSpacesByCreatorIds(userIds: string[]): Promise<XSpacesResponse> {
  if (userIds.length === 0) return {};
  const params = new URLSearchParams({
    user_ids: userIds.join(","),
    "space.fields": SPACE_FIELDS,
    "user.fields": USER_FIELDS,
    expansions: EXPANSIONS,
  });
  return xFetch(`/spaces/by/creator_ids?${params.toString()}`) as Promise<XSpacesResponse>;
}

/**
 * Build a user lookup map from the includes.users array.
 */
export function buildUserMap(users?: XUser[]): Map<string, XUser> {
  const map = new Map<string, XUser>();
  if (users) {
    for (const u of users) map.set(u.id, u);
  }
  return map;
}

/**
 * Derive a high-quality avatar URL for an X user.
 * The default X profile image URLs use "_normal" (48px). We upgrade to _400x400.
 */
export function upgradeAvatarUrl(url?: string): string | null {
  if (!url) return null;
  return url.replace("_normal", "_400x400");
}
