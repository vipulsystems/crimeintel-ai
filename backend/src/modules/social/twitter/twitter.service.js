// ⚠️ Twitter scraping disabled (policy restriction)
// Using static data for frontend

import axios from "axios";
import * as cheerio from "cheerio";

const NITTER_URL = "https://nitter.net";
const XQUIK_API_BASE_URL =
  process.env.XQUIK_API_BASE_URL || "https://xquik.com";
const XQUIK_SEARCH_QUERY =
  process.env.XQUIK_SEARCH_QUERY ||
  "crime OR police OR robbery OR theft OR accident";
const XQUIK_SEARCH_LIMIT = Number(process.env.XQUIK_SEARCH_LIMIT || 25);

function getXquikApiKey() {
  return process.env.XQUIK_API_KEY || "";
}

function getTweetText(tweet = {}) {
  return tweet.text || tweet.fullText || tweet.body || tweet.content || "";
}

function getTweetId(tweet = {}) {
  return tweet.id || tweet.tweetId || tweet.restId || tweet.conversationId || "";
}

function getAuthorUsername(tweet = {}) {
  return (
    tweet.username ||
    tweet.authorUsername ||
    tweet.userName ||
    tweet.author?.username ||
    tweet.author?.userName ||
    "xquik"
  );
}

function getTweetUrl(tweet = {}) {
  const existingUrl = tweet.url || tweet.tweetUrl || tweet.originalUrl;
  if (existingUrl) return existingUrl;

  const tweetId = getTweetId(tweet);
  const username = getAuthorUsername(tweet);
  return tweetId ? `https://x.com/${username}/status/${tweetId}` : "";
}

function mapXquikTweet(tweet = {}) {
  const text = getTweetText(tweet);
  const tweetId = getTweetId(tweet);

  return {
    source: "xquik",
    type: "twitter",
    text,
    media: [],
    originalPostUrl: getTweetUrl(tweet),
    scrapedAt: tweet.createdAt ? new Date(tweet.createdAt) : new Date(),
    fingerprint: tweetId || `${getAuthorUsername(tweet)}:${text.slice(0, 80)}`,
    raw: tweet,
  };
}

function getTweetResults(responseBody = {}) {
  if (Array.isArray(responseBody.tweets)) return responseBody.tweets;
  if (Array.isArray(responseBody.data)) return responseBody.data;
  if (Array.isArray(responseBody.items)) return responseBody.items;
  if (Array.isArray(responseBody.results)) return responseBody.results;
  return [];
}

async function fetchXquikPosts() {
  const apiKey = getXquikApiKey();

  if (!apiKey) {
    return {
      success: false,
      message: "Xquik API key not configured. Using static data.",
      data: [],
    };
  }

  const { data } = await axios.get(
    `${XQUIK_API_BASE_URL}/api/v1/x/tweets/search`,
    {
      headers: { "X-API-Key": apiKey },
      params: {
        limit: XQUIK_SEARCH_LIMIT,
        q: XQUIK_SEARCH_QUERY,
      },
      timeout: 15000,
    },
  );

  const posts = getTweetResults(data).map(mapXquikTweet).filter((post) => {
    return Boolean(post.text);
  });

  return {
    success: true,
    total: posts.length,
    data: posts,
  };
}

/**
 * Fetch tweets through Xquik when configured, otherwise keep static fallback.
 */
export const fetchTwitterPosts = async () => {
  const apiKey = getXquikApiKey();

  if (apiKey) {
    return fetchXquikPosts();
  }

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
