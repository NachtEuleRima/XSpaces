import { Router } from "express";
import { db, donationsTable } from "@workspace/db";

const router = Router();

router.post("/donations", async (req, res) => {
  const { username, amount, method } = req.body;

  if (!amount || !method) {
    res.status(400).json({ error: "amount and method are required" });
    return;
  }

  const parsed = Number(amount);
  if (isNaN(parsed) || parsed <= 0) {
    res.status(400).json({ error: "amount must be a positive number" });
    return;
  }

  const [created] = await db
    .insert(donationsTable)
    .values({
      username: username ? String(username).replace(/^@/, "").toLowerCase().trim() : null,
      amount: parsed,
      method: String(method),
    })
    .returning();

  req.log.info({ id: created.id, username: created.username, amount: created.amount, method: created.method }, "donation recorded");
  res.status(201).json({ id: created.id });
});

export default router;
