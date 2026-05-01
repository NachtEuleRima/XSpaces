import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const donationsTable = pgTable("donations", {
  id: serial("id").primaryKey(),
  username: text("username"),
  amount: real("amount").notNull(),
  method: text("method").notNull(),
  donatedAt: timestamp("donated_at").notNull().defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donationsTable).omit({ id: true, donatedAt: true });
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donationsTable.$inferSelect;
