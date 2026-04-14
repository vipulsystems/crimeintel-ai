import express from "express";
import {
  loginUser,
  registerUser,
  getMe,
  updateUser,
} from "./auth.controller.js";

import { protect } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// AUTH
router.post("/login", loginUser);
router.post("/register", registerUser);

// USER
router.get("/me", protect, getMe);
router.put("/update", protect, updateUser);

export default router;