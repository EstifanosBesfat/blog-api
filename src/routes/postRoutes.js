const express = require("express");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  publish,
} = require("../controllers/postController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
} = require("../middlewares/validationMiddleware");
const router = express.Router();

// protected
router.post("/", authenticateToken, validateCreatePost, createPost);
// public
router.get("/", getPosts);
//update
router.put("/:id", authenticateToken, validatePostId, validateUpdatePost, updatePost);
// delete
router.delete("/:id", authenticateToken, validatePostId, deletePost);
// updating the status of a post to publish
router.put("/:id/publish", authenticateToken, validatePostId, publish);

module.exports = router;
