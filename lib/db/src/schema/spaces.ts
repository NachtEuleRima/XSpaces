import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const spacesTable = pgTable("spaces", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("upcoming"), // live | upcoming | ended
  spaceUrl: text("space_url").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  listenerCount: integer("listener_count").notNull().default(0),
  host: jsonb("host").notNull(),
  coHosts: jsonb("co_hosts").notNull().default([]),
  speakers: jsonb("speakers").notNull().default([]),
  topicTags: jsonb("topic_tags").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSpaceSchema = createInsertSchema(spacesTable).omit({ id: true, createdAt: true });
export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type Space = typeof spacesTable.$inferSelect;
