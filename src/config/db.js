require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres", // Make sure these match your .env
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "blog_db",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Validation: Crash app immediately if secrets are missing
if (!process.env.DB_PASSWORD) {
  throw new Error(" Fatal Error: DB_PASSWORD is missing in .env");
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
