import jwt from "jsonwebtoken";
import User from "../../modules/user/user.model.js"; // ✅ FIXED PATH

/**
 * Protect routes (JWT)
 */
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    return res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * Role-based access
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

/**
 * Shortcut for admin
 */
export const isAdmin = authorize("admin");

/**
 * Alias (optional, for backward compatibility)
 */
export const authenticate = protect;