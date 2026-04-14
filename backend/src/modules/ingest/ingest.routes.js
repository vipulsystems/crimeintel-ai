import express from "express";
import { ingestPost } from "./ingest.controller.js";

const router = express.Router();

// POST /api/ingest
router.post("/", ingestPost);

export default router;