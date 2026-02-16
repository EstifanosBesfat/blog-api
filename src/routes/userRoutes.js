const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // The multer config we made earlier

// POST /api/users/upload-profile
// 1. Authenticate (Must be logged in)
// 2. Upload (Multer processes the file named 'profilePicture')
// 3. Controller (Updates DB)
router.post(
  "/upload-profile",
  authenticateToken,
  upload.single("profilePicture"), 
  userController.uploadProfilePicture
);

module.exports = router;