const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// protected
router.post("/", authenticateToken, createPost);
// public
router.get("/", getPosts);

module.exports = router;
