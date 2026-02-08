require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // check if the token exists
  if (!token) {
    return res.status(401).json({ error: "Unauthoraized" });
  }

  // get token it usally looks like " Bearer <token>" so we need to split the string
  const token = authHeader.split(" ")[1];

  // verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // if token is expired or fake
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // success
    req.user = user; // now every route after this knows who the user is

    next();
  });
};

module.exports = { authenticateToken };
