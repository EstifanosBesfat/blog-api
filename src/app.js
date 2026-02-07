require("dotenv").config();
const express = require("express");
const helmet = require("helmet"); // Security headers
const morgan = require("morgan"); // Logger
const db = require("./config/db");

const app = express(express.json());
// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

const startServer = async () => {
  try {
    // check DB connection
    await db.query("select 1");
    console.log("database connected successfully");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("startup error:", error.message);
    process.exit(1);
  }
};

startServer();