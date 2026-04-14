import express from "express";
import { runRedditWorker } from "./reddit.worker.js";

const router = express.Router();

// 🔥 RUN REDDIT SCRAPER
router.get("/run", async (req, res) => {
  try {
    const result = await runRedditWorker();

    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;