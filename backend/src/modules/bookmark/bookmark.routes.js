import express from "express";
import {
  createBookmark,
  deleteBookmark,
  listBookmarks,
} from "./bookmark.controller.js";

import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// optional: enable auth if needed
router.use(authenticate);

router.post("/", createBookmark);
router.delete("/:postId", deleteBookmark);
router.get("/", listBookmarks);

export default router;