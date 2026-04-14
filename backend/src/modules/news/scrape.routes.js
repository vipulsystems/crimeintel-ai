import express from "express";
import { runScraperJob, getScraperStatus } from "./scraper.job.js";

const router = express.Router();

// ✅ START SCRAPER
router.get("/run", runScraperJob);

// ✅ STATUS (FOR POLLING)
router.get("/status", (req, res) => {
  res.json(getScraperStatus());
});

export default router;