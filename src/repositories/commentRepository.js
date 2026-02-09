const db = require("../config/db");

// create comment
const createComment = async (userId, postId, content) => {
  const comment = await db.query(
    "insert into comments (content, user_id, post_id) values ($1, $2, $3) returning *",
    [content, userId, postId],
  );
  return comment.rows[0];
};

//get comment by post id
const getCommentsByPostId = async (postId) => {
  const comments = await db.query(
    `select comments.id, users.username, comments.content, comments.created_at
        from comments join users on users.id = comments.user_id
        where post_id = $1
        order by comments.created_at`,
    [postId],
  );
  return comments.rows;
};

// find comment by id
const findCommentById = async (id) => {
  const result = await db.query("SELECT * FROM comments WHERE id = $1", [id]);
  return result.rows[0];
};

// delete comment by id
const deleteComment = async (id) => {
  await db.query("delete from comments where id = $1", [id]);
  return true;
};

module.exports = {
  createComment,
  getCommentsByPostId,
  findCommentById,
  deleteComment,
};
