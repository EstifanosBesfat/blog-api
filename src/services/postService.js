const {
  createPost,
  findAllPosts,
  findPostById,
  updatePost,
  deletePost,
} = require("../repositories/postRepository");

const createNewPost = async ({ title, content, userId }) => {
  const post = await createPost({ title, content, userId });
  return post;
};

const getAllPosts = async (page = 1, limit = 10) => {
  // 1. Calculate the Offset (The logic)
  // Page 1: (1-1)*10 = 0 (Skip 0)
  // Page 2: (2-1)*10 = 10 (Skip 10)
  const offset = (page - 1) * limit;

  // 2. Call Repo
  const posts = await findAllPosts(limit, offset);

  return {
    posts,
    page: parseInt(page),
    limit: parseInt(limit),
    total: posts.length, // (In a real app, we'd do a separate count(*) query here)
  };
};

const updatePostById = async (postId, userId, title, content) => {
  const post = await findPostById;
  if (!post) {
    throw new Error("Post not found");
  }

  // ownership check
  if (post.user_id !== userId) {
    throw new Error("Access Denied: You are not the author");
  }

  return await updatePost(postId, title, content);
};

const deletePostById = async (postId, userId) => {
  const post = await findPostById(postId);
  if (!post) throw new Error("Post not found");

  if (post.user_id !== userId) {
    throw new Error("Access Denied: You are not the author");
  }

  return await deletePost(postId);
};

module.exports = { createNewPost, getAllPosts, updatePostById, deletePostById };
