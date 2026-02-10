const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  createComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// for creating and reading
router.post("/posts/:postId/comments", authenticateToken, createComment);
router.get("/posts/:postId/comments", getComments);

// for deleting
router.delete("/comments/:id", authenticateToken, deleteComment);

module.exports = router;
