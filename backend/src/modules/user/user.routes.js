import express from "express";
import {
  getUsers,
  createUserService,
  getUserById,
  deleteUserService,
} from "./user.controller.js";

import {
  authenticate,
  isAdmin,
} from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// 🔐 All routes require authentication
router.use(authenticate);

// 👥 USERS (ADMIN ONLY)
router.get("/", isAdmin, getUsers);
router.post("/", isAdmin, createUserService);

router.get("/:id", isAdmin, getUserById);
router.delete("/:id", isAdmin, deleteUserService);

export default router;