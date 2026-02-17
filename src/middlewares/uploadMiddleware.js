const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary (Connect to your account)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-profiles', // The folder name in your Cloudinary dashboard
    allowed_formats: ['jpg', 'png', 'jpeg'], // Only allow images
    // public_id: (req, file) => 'user-' + req.user.id, // Optional: Custom filename
  },
});

// 3. Initialize Multer with Cloudinary Storage
const upload = multer({ storage: storage });

module.exports = upload;