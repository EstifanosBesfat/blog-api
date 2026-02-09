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

const findPostById = async (id) => {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    return result.rows[0];
};

const updatePost = async (id, title, content) => {
    const result = await db.query(
        "UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
        [title, content, id]
    );
    return result.rows[0];
};

const deletePost = async (id) => {
    await db.query("DELETE FROM posts WHERE id = $1", [id]);
    return true;
};

module.exports = { findAllPosts, createPost, deletePost, findPostById, updatePost };