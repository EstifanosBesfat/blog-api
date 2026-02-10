const {
  addComment,
  getPostComments,
  removeComment,
} = require("../services/commentService");

const createComment = async (req, res) => {
  const postId = req.params.postId;
  const content = req.body.content;
  if (!content) {
    return res.status(400).json({ error: "content cannot be empty" });
  }
  const userId = req.user.id;
  try {
    const comment = await addComment(userId, postId, content);
    res
      .status(201)
      .json({ message: "comment added successfully", comment: comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await getPostComments(postId);
    res.status(200).json({ message: "comments are here", comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(400).json({ error: "comment id is required" });
  }

  const userId = req.user.id;
  await removeComment(commentId, userId);
  res.status(200).json({message: "comment deleted successfully"});
};

module.exports = { createComment,getComments,deleteComment };
