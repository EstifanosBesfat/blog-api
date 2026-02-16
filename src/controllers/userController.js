const db = require("../config/db");

const uploadProfilePicture = async (req, res) => {
  // 1. Check if file exists (Multer middleware handles the upload)
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // 2. Create the URL
  // We will serve static files from the '/uploads' path
  const filePath = `/uploads/${req.file.filename}`;
  const userId = req.user.id;

  try {
    // 3. Update the Database
    const query = "UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING id, username, email, profile_picture";
    const result = await db.query(query, [filePath, userId]);

    // 4. Respond
    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database update failed" });
  }
};

module.exports = { uploadProfilePicture };