const { createPost, findAllPosts } = require("../repositories/postRepository");

const createNewPost = async ({ title, content, userId }) => {
  const post = await createPost({ title, content, userId });
  return post;
};

const getAllPosts = async () => {
  const posts = await findAllPosts();
  return posts;
};

module.exports = { createNewPosts, getAllPosts };
