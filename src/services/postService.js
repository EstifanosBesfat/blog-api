const {
  createPost,
  findAllPosts,
  findPostById,
  updatePost,
  deletePost,
  findPostByTitle,
} = require("../repositories/postRepository");
const db = require("../config/db");

const createNewPost = async ({ title, content, userId }) => {
  const existingPost = await findPostByTitle(title);
  if (existingPost) {
    throw new Error("A post with this title already exists");
  }
  const post = await createPost({ title, content, userId });
  return post;
};

const getAllPosts = async (page = 1, limit = 10, search) => {
  // Added 'search' param
  const offset = (page - 1) * limit;
  return await findAllPosts(limit, offset, search);
};

const updatePostById = async (postId, userId, title, content, status) => {
  const post = await findPostById(postId);
  if (!post) throw new Error("Post not found");
  if (post.user_id !== userId) throw new Error("Access Denied");

  // Pass status to repo
  return await updatePost(postId, title, content, status);
};

const deletePostById = async (postId, userId) => {
  const post = await findPostById(postId);
  if (!post) throw new Error("Post not found");

  if (post.user_id !== userId) {
    throw new Error("Access Denied: You are not the author");
  }

  return await deletePost(postId);
};

const publishPost = async (postId, userId) => {
  // 1. Get a dedicated client (connection) from the pool
  const client = await db.pool.connect();

  try {
    // 2. Start Transaction
    await client.query("BEGIN");

    // 3. Update Post Status
    await client.query("UPDATE posts SET status = $1 WHERE id = $2", [
      "published",
      postId,
    ]);

    // 4. Create System Comment (Using the user's ID)
    const systemMessage = `System: This post was officially published on ${new Date().toLocaleDateString()}`;
    await client.query(
      "INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3)",
      [systemMessage, userId, postId],
    );

    // 5. Commit (Save Changes)
    await client.query("COMMIT");

    return { message: "Post published successfully" };
  } catch (error) {
    // 6. Rollback (Undo Changes if error)
    await client.query("ROLLBACK");
    throw error; // Re-throw error so controller knows it failed
  } finally {
    // 7. Release connection back to pool (CRITICAL)
    client.release();
  }
};

module.exports = {
  createNewPost,
  getAllPosts,
  updatePostById,
  deletePostById,
  publishPost,
};
