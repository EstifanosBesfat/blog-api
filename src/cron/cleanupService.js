const cron = require("node-cron");
const db = require("../config/db");

const startCleanupJob = () => {
  // Schedule: Run every minute (For testing)
  // In production, use "0 0 * * *" (Every midnight)
  cron.schedule("* * * * *", async () => {
    console.log("🧹 Janitor Job: Starting cleanup of deleted posts...");

    try {
      // Logic: Delete posts marked 'deleted' that haven't been touched in 1 minute
      const query = `
        DELETE FROM posts 
        WHERE status = $1 
        AND updated_at <= NOW() - INTERVAL '1 minute'
      `;
      
      const result = await db.query(query, ["deleted"]);

      if (result.rowCount > 0) {
        console.log(`✅ Janitor Job: Permanently deleted ${result.rowCount} old posts.`);
      } else {
        console.log("ℹ️ Janitor Job: No old posts found to delete.");
      }

    } catch (error) {
      console.error("❌ Janitor Job Failed:", error.message);
    }
  });
};

module.exports = { startCleanupJob };