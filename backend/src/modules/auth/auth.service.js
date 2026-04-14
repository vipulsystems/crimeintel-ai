import User from "../user/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import UserLog from "../user/userLog.model.js";

// REGISTER USER
export const registerUser = async ({ name, email, username, password }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    username,
    password: hash,
  });

  return {
    success: true,
    user,
  };
};

// LOGIN USER
export const loginUser = async (req) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid user");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // 🌍 IP detection
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    null;

  let location = null;

  try {
    const geoRes = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,region,country,lat,lon`
    );
    const geo = await geoRes.json();

    if (geo.status === "success") {
      location = {
        city: geo.city,
        region: geo.region,
        country: geo.country,
        lat: geo.lat,
        lng: geo.lon,
      };
    }
  } catch {
    console.log("Geo lookup failed");
  }

  // Save login log
  await UserLog.create({
    userId: user._id,
    action: "login",
    ip,
    location,
    device: req.headers["user-agent"] || "Unknown",
    at: new Date(),
  });

  return {
    success: true,
    token,
    role: user.role,
    name: user.name,
    email: user.email,
  };
};

// GET CURRENT USER
export const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    success: true,
    user,
  };
};

// UPDATE USER
export const updateUser = async (userId, body) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Update fields dynamically
  Object.keys(body).forEach((key) => {
    if (key !== "password") {
      user[key] = body[key];
    }
  });

  // Handle password separately
  if (body.password) {
    const hash = await bcrypt.hash(body.password, 10);
    user.password = hash;
  }

  await user.save();

  return {
    success: true,
    message: "Profile updated",
    user: user.toObject({ getters: true }),
  };
};