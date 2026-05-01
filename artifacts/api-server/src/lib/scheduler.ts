import cron from "node-cron";
import { db, spacesTable } from "@workspace/db";
import { logger } from "./logger";

export function startScheduler() {
  // Run at midnight on the 1st and 15th of every month (~every 2 weeks)
  cron.schedule("0 0 1,15 * *", async () => {
    try {
      const result = await db.delete(spacesTable).returning({ id: spacesTable.id });
      logger.info({ deleted: result.length }, "Scheduled cleanup: spaces table cleared");
    } catch (err) {
      logger.error({ err }, "Scheduled cleanup: failed to clear spaces table");
    }
  });

  logger.info("Scheduler started — spaces table will be cleared on the 1st and 15th of each month");
}
