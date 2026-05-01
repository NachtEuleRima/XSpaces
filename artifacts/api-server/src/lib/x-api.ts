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
 * Note: Requires Basic or higher X API access.
 */
export async function searchSpacesByState(
  state: "live" | "scheduled",
  maxResults = 25
): Promise<XSpacesResponse> {
  // X API Spaces search requires at least one character query OR state filter
  // We search with a space or common term to get broad results
  const params = new URLSearchParams({
    state,
    max_results: String(Math.min(maxResults, 100)),
    "space.fields": SPACE_FIELDS,
    "user.fields": USER_FIELDS,
    expansions: EXPANSIONS,
  });

  // Use a very broad query to catch all spaces
  return xFetch(`/spaces/search?query=%20&${params.toString()}`) as Promise<XSpacesResponse>;
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
