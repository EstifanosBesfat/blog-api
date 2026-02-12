require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// Render.com provides a single "DATABASE_URL" string.
// Localhost uses individual variables (DB_USER, DB_PASS, etc.)
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  // If in production, use the long URL. If local, ignore this line.
  connectionString: isProduction ? connectionString : undefined,
  
  // If local, use these. If production, these are ignored.
  user: isProduction ? undefined : (process.env.DB_USER || "postgres"),
  host: isProduction ? undefined : (process.env.DB_HOST || "localhost"),
  database: isProduction ? undefined : (process.env.DB_NAME || "blog_db"),
  password: isProduction ? undefined : process.env.DB_PASSWORD,
  port: isProduction ? undefined : (process.env.DB_PORT || 5432),

  // SSL is REQUIRED for Render, but breaks Localhost.
  // { rejectUnauthorized: false } allows self-signed certs (common in cloud).
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
  pool, // <--- KEEPING THIS IS CRITICAL FOR TRANSACTIONS
};