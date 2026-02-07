const { registerUser } = require("../services/authService");

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  // valdiate input (bouncer)
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }
  try {
    const user = await registerUser({username, password, email});
    return res.status(201).json({ message: "user registered!",
        user
     });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {register}