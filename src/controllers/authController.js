const authService = require("../services/authService");

// --- REGISTER ---
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  try {
    const user = await authService.registerUser({ username, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- LOGIN (NEW) ---
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate Input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

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
    // 4. Handle Errors (401 Unauthorized)
    res.status(401).json({ error: error.message });
  }
};

module.exports = { 
  register, 
  login 
};