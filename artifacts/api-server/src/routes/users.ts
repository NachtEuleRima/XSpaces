import { Router } from "express";

const router = Router();

router.get("/users/search", async (req, res) => {
  const q = ((req.query.q as string) ?? "").trim().replace(/^@/, "");
  if (!q || q.length < 2) {
    res.json({ user: null });
    return;
  }

  const token = process.env["X_BEARER_TOKEN"];
  if (!token) {
    res.status(500).json({ error: "X_BEARER_TOKEN not configured" });
    return;
  }

  try {
    const r = await fetch(
      `https://api.twitter.com/2/users/by/username/${encodeURIComponent(q)}?user.fields=name,profile_image_url,username`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!r.ok) {
      res.json({ user: null });
      return;
    }
    const data = (await r.json()) as {
      data?: { id: string; username: string; name: string; profile_image_url?: string };
    };
    if (!data.data) {
      res.json({ user: null });
      return;
    }
    res.json({
      user: {
        id: data.data.id,
        username: data.data.username,
        name: data.data.name,
        avatar: data.data.profile_image_url ?? null,
      },
    });
  } catch {
    res.json({ user: null });
  }
});

export default router;
