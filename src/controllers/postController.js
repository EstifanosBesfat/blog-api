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
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPost, getPosts };
