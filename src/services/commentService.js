const {
  createComment,
  getCommentsByPostId,
  findCommentById,
  deleteComment,
} = require("../repositories/commentRepository");

// add comment
const addComment = async (userId, postId, content) => {
  return await createComment(userId, postId, content);
};

// get comments for a given post
const getPostComments = async (postId) => {
  return await getCommentsByPostId(postId);
};

// remove comment
const removeComment = async (commentId, userId) => {
  // first find the comment
  const comment = await findCommentById(commentId);
  // check if the comment exists
  if (!comment) {
    throw new Error("comment doesn't exist");
  }

  // check ownership
  if (comment.user_id !== userId) {
    throw new Error("Access Denied");
  }
  await deleteComment(commentId);
};

module.exports = {
  addComment,
  getPostComments,
  removeComment,
};
