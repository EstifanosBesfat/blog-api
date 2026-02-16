require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./config/db"); // Import DB to check connection
const authRoutes = require("./routes/authRoutes"); // Import Routes
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");
const cors = require("cors");
const { startCleanupJob } = require("./cron/cleanupService");
const { apiLimiter } = require("./middlewares/rateLimitMiddleware");
const logger = require("./utils/logger");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

const app = express();

// --- MIDDLEWARES ---
app.use(express.json()); // Body parser
app.use(cors());
app.use(helmet()); // Security
app.use(morgan("dev")); // Logging
// --- STATIC FILES ---
// This tells Express: "If someone asks for /uploads/image.jpg, look in the uploads folder"
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- ROUTES ---
// Mounts auth routes at /api/auth
// Example: POST http://localhost:3000/api/auth/register
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentRoutes);
// Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- STARTUP LOGIC ---
if (require.main === module) {
  // Only run this if we run "node src/app.js" directly
  const startServer = async () => {
    try {
      // Check Database
      await db.query("SELECT 1");
      logger.info("✅ Database Connected Successfully");

      // Start the Janitor
      startCleanupJob();
      logger.info("🕰️ Cron Jobs Scheduled");

      // Start Server
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`);
      });
    } catch (error) {
      logger.error("❌ Startup Error:", error.message);
      process.exit(1);
    }
  };
  startServer();
}

module.exports = app; // export app for testing
