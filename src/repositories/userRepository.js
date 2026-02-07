const db = require("../config/db");

const createUser = async ({ username, email, password }) => {
  // SQL Injection protection: use $1, $2, $3 and pass the array
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, role, created_at
  `;
  // We return everything EXCEPT the password for safety
  const result = await db.query(query, [username, email, password]);
  return result.rows[0];
};

const findEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findEmail,
};