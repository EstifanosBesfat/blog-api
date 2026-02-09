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

const getAllPosts = async () => {
  const posts = await findAllPosts();
  return posts;
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
