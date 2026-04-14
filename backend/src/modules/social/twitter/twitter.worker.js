// ⚠️ NOT USED CURRENTLY

import { scrapeTwitter } from "./twitter.service.js";
import { saveScrapedPosts } from "../../post/post.service.js";

export const runTwitterWorker = async () => {
  console.log("🚀 Twitter worker started...");

  try {
    const result = await scrapeTwitter();

    if (!result?.data?.length) {
      console.log("⚠ No tweets found");
      return;
    }

    const saved = await saveScrapedPosts(result.data);

    console.log(
      `✅ Twitter Worker Done → scraped: ${result.data.length}, saved: ${saved.saved}`
    );

  } catch (err) {
    console.error("❌ Twitter worker error:", err.message);
  }
};