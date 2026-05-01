import { Router } from "express";
import { db, feedbackTable } from "@workspace/db";

const router = Router();

router.post("/feedback", async (req, res) => {
  const { username, message } = req.body;

  if (!message || !String(message).trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const [created] = await db
    .insert(feedbackTable)
    .values({
      username: username ? String(username).replace(/^@/, "").toLowerCase().trim() : null,
      message: String(message).trim(),
    })
    .returning();

  req.log.info({ id: created.id, username: created.username }, "feedback recorded");
  res.status(201).json({ id: created.id });
});

export default router;
