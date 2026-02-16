const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validationMiddleware");
const { authLimiter } = require("../middlewares/rateLimitMiddleware");

router.post("/register", validateRegister, authController.register);
router.post("/login", authLimiter,validateLogin, authController.login);
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
