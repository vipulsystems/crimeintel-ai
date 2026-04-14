import { scrapeAllFeeds } from "./scraper.service.js";
import { fetchMissingImages } from "../post/post.service.js";

// ✅ GLOBAL STATE (for dashboard polling)
let scraperState = {
  running: false,
  lastRun: null,
  lastStatus: "idle",
};

// ✅ GET STATUS (used by /scrape/status)
export const getScraperStatus = () => scraperState;

/* =========================================================
   ✅ CORE SCRAPER (used by CRON + CONTROLLER)
========================================================= */
export const runScraperCore = async () => {
  if (scraperState.running) {
    console.log("⚠️ Scraper already running");
    return { success: false, message: "Already running" };
  }

  scraperState.running = true;
  scraperState.lastStatus = "running";

  const city = process.env.DEFAULT_CITY || "Nagpur";
  const daysBack = Number(process.env.SCRAPE_DAYS || 1);

  console.log(`🚀 Scraper started for ${city}...`);

  try {
    const result = await scrapeAllFeeds({ city, daysBack });

    console.log("🖼️ Fixing missing images...");
    await fetchMissingImages(50);

    scraperState.running = false;
    scraperState.lastRun = new Date();
    scraperState.lastStatus = "completed";

    console.log("✅ Scraper finished:", result);

    return {
      success: true,
      ...result,
    };
  } catch (err) {
    scraperState.running = false;
    scraperState.lastStatus = "failed";

    console.error("❌ Scraper failed:", err.message);

    throw err;
  }
};

/* =========================================================
   ✅ CONTROLLER (used by API route)
========================================================= */
export const runScraperJob = async (req, res) => {
  try {
    const result = await runScraperCore();

    return res.json({
      success: true,
      message: "Scraper completed",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};