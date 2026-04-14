// ⚠️ Twitter scraping disabled (policy restriction)
// Using static data for frontend

import axios from "axios";
import * as cheerio from "cheerio";

const NITTER_URL = "https://nitter.net";

/**
 * Fetch tweets (DISABLED)
 */
export const fetchTwitterPosts = async () => {
  console.log("⚠ Twitter scraping disabled");

  return {
    success: false,
    message: "Twitter scraping not allowed. Using static data.",
    data: [],
  };
};

/**
 * FUTURE: Real scraping (ready but not used)
 */
export const scrapeTwitter = async (username = "NagpurPolice") => {
  try {
    const url = `${NITTER_URL}/${username}`;

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);

    const tweets = [];

    $(".timeline-item")
      .slice(0, 25)
      .each((_, el) => {
        const text = $(el).find(".tweet-content").text().trim();

        const link = $(el).find(".tweet-date > a").attr("href") || "";
        const tweetId = link.split("/").pop();

        const dateStr =
          $(el).find("span.tweet-date > a").attr("title") || null;

        const tweetedAt = dateStr ? new Date(dateStr) : new Date();

        const media = [];

        $(el)
          .find("a.attachment")
          .each((_, mediaEl) => {
            const src = $(mediaEl).attr("href");
            if (src) {
              media.push({
                url: NITTER_URL + src,
                type: "image",
              });
            }
          });

        tweets.push({
          source: "twitter",
          text,
          media,
          originalPostUrl: `${NITTER_URL}${link}`,
          scrapedAt: tweetedAt,
          fingerprint: tweetId,
        });
      });

    return {
      success: true,
      total: tweets.length,
      data: tweets,
    };
  } catch (err) {
    console.error("❌ Twitter scrape error:", err.message);

    return {
      success: false,
      message: err.message,
      data: [],
    };
  }
};