require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./config/db"); // Import DB to check connection
const authRoutes = require("./routes/authRoutes"); // Import Routes
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

// --- MIDDLEWARES ---
app.use(express.json()); // Body parser
app.use(helmet()); // Security
app.use(morgan("dev")); // Logging

// --- ROUTES ---
// Mounts auth routes at /api/auth
// Example: POST http://localhost:3000/api/auth/register
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

// --- STARTUP LOGIC ---
const startServer = async () => {
  try {
    // 1. Check Database
    await db.query("SELECT 1");
    console.log("✅ Database Connected Successfully");

    // 2. Start Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();
