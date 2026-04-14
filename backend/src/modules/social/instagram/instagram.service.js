// ⚠️ Instagram scraping disabled (policy restriction)
// This service is ready for future activation

import { scrapeInstagram } from "./instagram.worker.js";
import { saveScrapedPosts } from "../../post/post.service.js";

/**
 * Fetch Instagram posts (currently disabled)
 */
export const fetchInstagramPosts = async () => {
  console.log("⚠ Instagram scraping is disabled");

  return {
    success: false,
    message: "Instagram scraping not allowed. Using static data.",
    data: [],
  };
};

/**
 * FUTURE: Enable scraping + saving
 */
export const fetchAndStoreInstagramPosts = async () => {
  try {
    console.log("🚀 Running Instagram scraper...");

    const data = await scrapeInstagram();

    const result = await saveScrapedPosts(data);

    return {
      success: true,
      scraped: data.length,
      saved: result.saved,
    };

  } catch (err) {
    console.error("❌ Instagram service error:", err.message);

    return {
      success: false,
      message: "Instagram scraping failed",
    };
  }
};