import express from "express";
import {
  listPosts,
  deletePost,
  flagPost,
  getUserLogs,
  getAllUsers, // ✅ ADD THIS
} from "./admin.controller.js";

import {
  protect,
  authorize,
  isAdmin,
} from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// ================= POSTS =================
router.get("/posts", protect, authorize("admin"), listPosts);
router.delete("/posts/:id", protect, authorize("admin"), deletePost);
router.put("/posts/:id/flag", protect, authorize("admin"), flagPost);

// ================= USERS =================
// ✅ ADD THIS BLOCK
router.get("/users", protect, authorize("admin"), getAllUsers);

// ================= USER LOGS =================
router.get("/users/:id/logs", protect, isAdmin, getUserLogs);

export default router;