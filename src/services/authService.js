const bcrypt = require("bcrypt");
const { createUser, findEmail } = require("../repositories/userRepository");
const { generateToken } = require("../utils/jwtHelper");

// register new user
const registerUser = async (user) => {
  const { username, email, password } = user;

  // check if user already exists
  const existingUser = await findEmail(email);
  if (existingUser) {
    throw new Error("User already exist");
  }
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create user
  const newUser = await createUser({
    username,
    email,
    password: hashedPassword,
  });
  return newUser;
};

// login existing user
const loginUser = async ({ email, password }) => {
  // check if user is found
  const user = await findEmail(email);
  if (!user) {
    // don't use 'user not found' it helps hackers
    throw new Error("Invalid credentials");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // generate token to make the login process easier for future
  const token = generateToken(user);

  return { token, user };
};

module.exports = { registerUser, loginUser };
