import express from "express";
import {
  getCrimes,
  getCrimeStats,
} from "./crime.controller.js";

import { protect } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getCrimes);
router.get("/stats", protect, getCrimeStats);

export default router;