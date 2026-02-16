const authService = require("../services/authService");
const { sendError } = require("../utils/errorResponse");

// --- REGISTER ---
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await authService.registerUser({ username, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    sendError(res, error);
  }
};

// --- LOGIN (NEW) ---
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 2. Call Service (returns token + user info)
    const data = await authService.loginUser({ email, password });
    
    // 3. Send Response (200 OK)
    res.status(200).json({
      message: "Login successful",
      token: data.token,
      user: {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role
      }
    });
  } catch (error) {
    // 4. Handle Errors
    sendError(res, error);
  }
};

module.exports = { 
  register, 
  login 
};
