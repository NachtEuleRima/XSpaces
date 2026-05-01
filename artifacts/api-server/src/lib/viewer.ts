const BEARER_TOKEN = process.env["X_BEARER_TOKEN"];
const VIEWER_CACHE_TTL = 30 * 60 * 1000; // 30 minutes per viewer

interface CacheEntry {
  following: Set<string> | null; // null = fetch failed, use owner cache
  expires: number;
}

const viewerFollowingCache = new Map<string, CacheEntry>();

/**
 * Returns the viewer's following set, or undefined if the lookup failed.
 * Callers should fall back to the owner's following cache when undefined is returned.
 */
export async function getViewerFollowing(username: string): Promise<Set<string> | undefined> {
  const key = username.toLowerCase();
  const cached = viewerFollowingCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.following ?? undefined;
  }

  if (!BEARER_TOKEN) return undefined;

  const following = new Set<string>();
  let success = false;

  try {
    // Look up user ID from username
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}`,
      { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } },
    );
    if (!userRes.ok) {
      viewerFollowingCache.set(key, { following: null, expires: Date.now() + VIEWER_CACHE_TTL });
      return undefined;
    }

    const userData = (await userRes.json()) as { data?: { id?: string } };
    const userId = userData.data?.id;
    if (!userId) {
      viewerFollowingCache.set(key, { following: null, expires: Date.now() + VIEWER_CACHE_TTL });
      return undefined;
    }

    // Fetch following list — up to 2 pages (2000 follows) to stay within rate limits
    let nextToken: string | undefined;
    for (let page = 0; page < 2; page++) {
      const params = new URLSearchParams({ max_results: "1000", "user.fields": "username" });
      if (nextToken) params.set("pagination_token", nextToken);

      const followRes = await fetch(
        `https://api.twitter.com/2/users/${userId}/following?${params}`,
        { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } },
      );
      if (!followRes.ok) break;

      const followData = (await followRes.json()) as {
        data?: { username?: string }[];
        meta?: { next_token?: string };
      };

      for (const u of followData.data ?? []) {
        if (u.username) following.add(u.username.toLowerCase());
      }
      success = true;

      nextToken = followData.meta?.next_token;
      if (!nextToken) break;

      // Courtesy delay between pages
      await new Promise(r => setTimeout(r, 300));
    }
  } catch {
    // Swallow errors — signal failure via undefined
  }

  if (!success) {
    // Cache the failure so we don't hammer the API on every request
    viewerFollowingCache.set(key, { following: null, expires: Date.now() + 5 * 60 * 1000 }); // 5 min for failures
    return undefined;
  }

  viewerFollowingCache.set(key, { following, expires: Date.now() + VIEWER_CACHE_TTL });
  return following;
}
