import User from "./user.model.js";
import bcrypt from "bcryptjs";

/**
 * Get paginated users
 */
export const getUsers = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password")
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments();

  return { users, total };
};

/**
 * Create new user
 */
export const createUserService = async (data) => {
  let {
    name,
    email,
    password,
    role,
    username,
    ...rest
  } = data;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // auto username
  if (!username) {
    username = email.split("@")[0].toLowerCase();
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Email already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    username,
    password: hash,
    role,
    ...rest,
  });

  return user;
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  return User.findById(id).select("-password").lean();
};

/**
 * Delete user
 */
export const deleteUserService = async (id) => {
  return User.findByIdAndDelete(id);
};