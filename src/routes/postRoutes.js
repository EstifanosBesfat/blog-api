const express = require("express");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// protected
router.post("/", authenticateToken, createPost);
// public
router.get("/", getPosts);
//update
router.put("/:id", authenticateToken, updatePost);
// delete
router.delete("/:id", authenticateToken, deletePost);

module.exports = router;
