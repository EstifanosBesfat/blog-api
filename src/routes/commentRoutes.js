const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validatePostIdParam,
  validateCreateComment,
  validateCommentId,
} = require("../middlewares/validationMiddleware");
const {
  createComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// for creating and reading
router.post(
  "/posts/:postId/comments",
  authenticateToken,
  validatePostIdParam,
  validateCreateComment,
  createComment,
);
router.get("/posts/:postId/comments", validatePostIdParam, getComments);

// for deleting
router.delete("/comments/:id", authenticateToken, validateCommentId, deleteComment);

module.exports = router;
