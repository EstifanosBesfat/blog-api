const postService = require("../services/postService");

const createPost = async (req, res) => {
  const { title, content } = req.body;

  // Validate Input
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const postId = req.params.id;
  const userId = req.user.id;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const post = await postService.updatePostById(
      postId,
      userId,
      title,
      content,
    );
    res.status(200).json({ message: "post updated successfully", post: post });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ error: "post id is missing." });
  }

  const userId = req.user.id;

  try {
    const deletedPost = await postService.deletePostById(postId, userId);
    res
      .status(200)
      .json({ message: "post deleted successfully", post: deletedPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const publish = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await postService.publishPost(postId, userId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost, publish };
