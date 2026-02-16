const Joi = require("joi");

const validate = (schema, property = "body") => (req, res, next) => {
  const { error } = schema.validate(req[property], { abortEarly: true });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

const postIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const postIdParamSchema = Joi.object({
  postId: Joi.number().integer().positive().required(),
});

const createPostSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  content: Joi.string().trim().min(1).required(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  content: Joi.string().trim().min(1).required(),
  status: Joi.string().valid("draft", "published", "deleted").optional(),
});

const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),
});

const validateRegister = validate(registerSchema);
const validateLogin = validate(loginSchema);
const validateCreatePost = validate(createPostSchema);
const validateUpdatePost = validate(updatePostSchema);
const validatePostId = validate(postIdSchema, "params");
const validatePostIdParam = validate(postIdParamSchema, "params");
const validateCreateComment = validate(createCommentSchema);
const validateCommentId = validate(postIdSchema, "params");

module.exports = {
  validateRegister,
  validateLogin,
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
  validatePostIdParam,
  validateCreateComment,
  validateCommentId,
};
