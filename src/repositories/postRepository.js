const db = require("../config/db");

const createPost = async ({ title, content, userId }) => {
  const query = `
    INSERT INTO posts (title, content, user_id) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  const result = await db.query(query, [title, content, userId]);
  return result.rows[0]; // Return just the new post object
};

const findAllPosts = async () => {
  const result = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
  return result.rows; // Return the array of posts
};

module.exports = { findAllPosts, createPost };