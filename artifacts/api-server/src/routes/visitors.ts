import { Router } from "express";
import { db, visitorsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { UpsertVisitorBody } from "@workspace/api-zod";

const router = Router();

router.post("/visitors", async (req, res) => {
  const parsed = UpsertVisitorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error });
    return;
  }

  const { username } = parsed.data;
  const cleanUsername = username.replace(/^@/, "").toLowerCase().trim();

  const existing = await db
    .select()
    .from(visitorsTable)
    .where(eq(visitorsTable.username, cleanUsername));

  if (existing.length > 0) {
    const [updated] = await db
      .update(visitorsTable)
      .set({ lastVisitedAt: new Date() })
      .where(eq(visitorsTable.username, cleanUsername))
      .returning();
    res.json({
      id: updated.id,
      username: updated.username,
      firstVisitedAt: updated.firstVisitedAt.toISOString(),
      lastVisitedAt: updated.lastVisitedAt.toISOString(),
    });
    return;
  }

  const [created] = await db
    .insert(visitorsTable)
    .values({ username: cleanUsername })
    .returning();

  res.json({
    id: created.id,
    username: created.username,
    firstVisitedAt: created.firstVisitedAt.toISOString(),
    lastVisitedAt: created.lastVisitedAt.toISOString(),
  });
});

router.get("/visitors/count", async (_req, res) => {
  const result = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(visitorsTable);
  res.json({ count: result[0]?.count ?? 0 });
});

export default router;
