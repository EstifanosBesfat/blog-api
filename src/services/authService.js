const bcrypt = require("bcrypt");
const { createUser, findEmail } = require("../repositories/userRepository");

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
  newUser = await createUser({ username, email, password: hashedPassword });
  return newUser;
};

module.exports = { registerUser };
