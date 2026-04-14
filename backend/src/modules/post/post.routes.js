import express from "express";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

import {
  getPosts,
  getPostById,
  getPostStats,
} from "./post.controller.js";

const router = express.Router();

// ✅ ORDER MATTERS
router.get("/stats", authenticate, getPostStats);
router.get("/", authenticate, getPosts);
router.get("/:id", authenticate, getPostById);

export default router;