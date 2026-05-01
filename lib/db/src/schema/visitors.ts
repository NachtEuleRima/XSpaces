import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const visitorsTable = pgTable("visitors", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  firstVisitedAt: timestamp("first_visited_at").notNull().defaultNow(),
  lastVisitedAt: timestamp("last_visited_at").notNull().defaultNow(),
});

export const insertVisitorSchema = createInsertSchema(visitorsTable).omit({ id: true, firstVisitedAt: true, lastVisitedAt: true });
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitorsTable.$inferSelect;
