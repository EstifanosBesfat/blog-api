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
    // 1. Extract Query Params (Default to Page 1, Limit 10 if missing)
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // 2. Call Service
    const data = await postService.getAllPosts(page, limit);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  const { title, content } = req.params;
  const { postId } = req.params;
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

module.exports = { createPost, getPosts, updatePost, deletePost };
