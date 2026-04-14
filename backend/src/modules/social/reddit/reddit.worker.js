// src/modules/social/reddit/reddit.worker.js

import { fetchRedditPosts } from "./reddit.service.js";
import { saveScrapedPosts } from "../../post/post.service.js";

/**
 * Reddit Worker
 * Fetch + Normalize + Save
 */
export const runRedditWorker = async () => {
  console.log("🚀 Reddit worker started...");

  try {
    // 1. Fetch
    const result = await fetchRedditPosts({ limit: 30 });

    if (!result?.data?.length) {
      console.log("⚠ No Reddit posts found");
      return { success: false, message: "No data" };
    }

    // 🔥 2. NORMALIZE DATA (VERY IMPORTANT)
    const normalized = result.data.map((post) => ({
      ...post,

      type: "reddit", // ✅ REQUIRED
      createdAt: post.scrapedAt || new Date(), // ✅ FIX stats

      media: Array.isArray(post.media) ? post.media : [], // ✅ SAFE

      location: post.location || {
        city: "Nagpur",
        state: "Maharashtra",
      },
    }));

    // 3. Save
    const saved = await saveScrapedPosts(normalized);

    console.log(
      `✅ Reddit Worker Done → scraped: ${normalized.length}, saved: ${saved.saved}`
    );

    return {
      success: true,
      scraped: normalized.length,
      saved: saved.saved,
    };

  } catch (err) {
    console.error("❌ Reddit worker error:", err.message);

    return {
      success: false,
      message: err.message,
    };
  }
};