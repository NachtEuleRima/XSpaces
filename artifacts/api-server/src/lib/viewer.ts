const BEARER_TOKEN = process.env["X_BEARER_TOKEN"];
const VIEWER_CACHE_TTL = 30 * 60 * 1000; // 30 minutes per viewer

interface CacheEntry {
  following: Set<string>;
  expires: number;
}

const viewerFollowingCache = new Map<string, CacheEntry>();

export async function getViewerFollowing(username: string): Promise<Set<string>> {
  const key = username.toLowerCase();
  const cached = viewerFollowingCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.following;

  const following = new Set<string>();

  if (!BEARER_TOKEN) return following;

  try {
    // Look up user ID from username
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}`,
      { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } },
    );
    if (!userRes.ok) return following;

    const userData = (await userRes.json()) as { data?: { id?: string } };
    const userId = userData.data?.id;
    if (!userId) return following;

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

      nextToken = followData.meta?.next_token;
      if (!nextToken) break;

      // Courtesy delay between pages
      await new Promise(r => setTimeout(r, 300));
    }
  } catch {
    // Swallow errors — return empty set (no personalization)
  }

  viewerFollowingCache.set(key, { following, expires: Date.now() + VIEWER_CACHE_TTL });
  return following;
}
