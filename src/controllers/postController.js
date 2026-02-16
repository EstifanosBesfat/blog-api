const postService = require("../services/postService");
const { sendError } = require("../utils/errorResponse");

const createPost = async (req, res) => {
  const { title, content } = req.body;

  // Get User ID from Token (Middleware put it there)
  const userId = req.user.id;

  try {
    // Call Service
    const post = await postService.createNewPost({ title, content, userId });

    // Send Response
    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    sendError(res, error);
  }
};

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null; // NEW

    // Pass 'search' to service
    const posts = await postService.getAllPosts(page, limit, search);

    res.status(200).json(posts);
  } catch (error) {
    sendError(res, error);
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body; // Added status
  const userId = req.user.id;

  try {
    // Pass status
    const post = await postService.updatePostById(id, userId, title, content, status);
    res.status(200).json({ message: "Update successful", post });
  } catch (error) {
    sendError(res, error);
  }
};
const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const deletedPost = await postService.deletePostById(postId, userId);
    res
      .status(200)
      .json({ message: "post deleted successfully", post: deletedPost });
  } catch (error) {
    sendError(res, error);
  }
};

const publish = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await postService.publishPost(postId, userId);
    res.status(200).json(post);
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost, publish };
