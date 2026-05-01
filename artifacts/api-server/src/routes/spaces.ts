import { Router } from "express";
import { db, spacesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { GetSpaceParams } from "@workspace/api-zod";
import { syncIfStale, syncSpacesFromX } from "../lib/sync.js";

const router = Router();

const OWNER_USERNAME = (process.env["OWNER_X_USERNAME"] ?? "").toLowerCase();

type Participant = { username?: string };

function isOwnerSpace(space: typeof spacesTable.$inferSelect): boolean {
  if (!OWNER_USERNAME) return false;
  const host = space.host as Participant | null;
  const coHosts = space.coHosts as Participant[];
  const speakers = space.speakers as Participant[];
  const all = [host, ...coHosts, ...speakers].filter(Boolean) as Participant[];
  return all.some(p => p.username?.toLowerCase() === OWNER_USERNAME);
}

function formatSpace(space: typeof spacesTable.$inferSelect) {
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
    isMine: isOwnerSpace(space),
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
    res.json(spaces.map(formatSpace));
  });
});

router.get("/spaces/live", async (req, res) => {
  await withSync(async () => {
    const spaces = await db
      .select()
      .from(spacesTable)
      .where(eq(spacesTable.status, "live"))
      .orderBy(desc(spacesTable.listenerCount));
    res.json(spaces.map(formatSpace));
  });
});

router.get("/spaces/upcoming", async (req, res) => {
  await withSync(async () => {
    const spaces = await db
      .select()
      .from(spacesTable)
      .where(eq(spacesTable.status, "upcoming"))
      .orderBy(spacesTable.scheduledAt);
    res.json(spaces.map(formatSpace));
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
