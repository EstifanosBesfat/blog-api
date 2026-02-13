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

const findAllPosts = async (limit = 10, offset = 0, search = null) => {
  let query = `
        SELECT posts.id, posts.title, posts.content,posts.status, posts.created_at, users.username 
        FROM posts 
        JOIN users ON posts.user_id = users.id
        where status != $1
    `;

  const params = ["deleted", limit, offset];

  // 1. Dynamic Filtering
  if (search) {
    // We add the WHERE clause safely
    query += ` and posts.title ILIKE $4 `;
    params.push(`%${search}%`); // % means "anything before or after"
  }

  // 2. Order and Limit
  query += ` ORDER BY posts.created_at DESC LIMIT $2 OFFSET $3`;

  const result = await db.query(query, params);
  return result.rows;
};

const findPostById = async (id) => {
  const result = await db.query(
    "SELECT * FROM posts WHERE id = $1 and status != $2",
    [id, "deleted"],
  );
  return result.rows[0];
};

const findPostByTitle = async (title) => {
  const result = await db.query(
    "select * from posts where title = $1 and status != $2",
    [title, "deleted"],
  );
  return result.rows[0];
};

const updatePost = async (id, title, content) => {
  const result = await db.query(
    "UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
    [title, content, id],
  );
  return result.rows[0];
};

const deletePost = async (id) => {
  await db.query("update posts set status = $1 WHERE id = $2", ["deleted", id]);
  return true;
};

module.exports = {
  findAllPosts,
  createPost,
  deletePost,
  findPostById,
  updatePost,
  findPostByTitle,
};
