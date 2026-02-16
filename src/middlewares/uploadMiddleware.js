const multer = require("multer");
const path = require("path");

// 1. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files to the 'uploads' folder in the root directory
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create a unique filename: userid-timestamp.extension
    // Example: user-5-167888899.jpg
    const userId = req.user ? req.user.id : "unknown";
    const ext = path.extname(file.originalname);
    cb(null, `user-${userId}-${Date.now()}${ext}`);
  },
});

// 2. Filter (Only allow Images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"));
  }
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
});

module.exports = upload;