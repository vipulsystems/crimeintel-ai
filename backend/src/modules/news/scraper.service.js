import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";
import puppeteer from "puppeteer";
import Post from "../post/post.model.js";

const NAGPUR_CITY = "Nagpur";
const NAGPUR_STATE = "Maharashtra";

const TRUSTED_DOMAINS = [
  "nagpurtoday.in",
  "thelivenagpur.com",
  "ucnnews.live",
  "aajtak.in",
  "timesofindia.indiatimes.com",
  "lokmat.com",
  "maharashtratimes.com",
  "esakal.com",
  "newsdata.io",
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0 Safari/537.36",
];

const md5 = (str = "") =>
  crypto.createHash("md5").update(String(str)).digest("hex");

const normalize = (t = "") => t.replace(/\s+/g, " ").trim();

const randomUA = () =>
  USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

/* ---------- CATEGORY ---------- */
function detectCategory(text = "") {
  const t = text.toLowerCase();
  if (/murder|हत्या/.test(t)) return "Murder";
  if (/robbery|चोरी|दरोडा/.test(t)) return "Robbery";
  if (/accident|अपघात/.test(t)) return "Accident";
  if (/rape|बलात्कार/.test(t)) return "Sexual offence";
  if (/kidnap|अपहरण/.test(t)) return "Kidnapping";
  if (/drugs|गांजा/.test(t)) return "Narcotics";
  return "Other";
}

/* ---------- CREDIBILITY ---------- */
function credibility(source = "", media = 0) {
  let s = 0.3;
  if (TRUSTED_DOMAINS.some((d) => source.includes(d))) s += 0.4;
  if (media > 0) s += 0.1;

  const score = Math.min(1, s);

  return {
    credibilityScore: score,
    credibility: score > 0.7 ? "high" : score >= 0.4 ? "medium" : "low",
  };
}

/* ---------- FETCH ---------- */
async function fetchHtmlAxios(url) {
  try {
    const res = await axios.get(url, {
      timeout: 15000,
      headers: { "User-Agent": randomUA() },
    });
    return res.data;
  } catch {
    return null;
  }
}

let browser = null;

async function getBrowser() {
  if (browser) return browser;

  browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  return browser;
}

async function fetchHtmlPuppeteer(url) {
  try {
    const br = await getBrowser();
    const page = await br.newPage();

    await page.setUserAgent(randomUA());
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const html = await page.content();
    await page.close();

    return html;
  } catch {
    return null;
  }
}

/* ---------- MAIN SCRAPER ---------- */
export async function scrapeAllFeeds() {
  console.log("🚀 Scraping started...");

  const all = [];

  const sources = [
    "https://thelivenagpur.com/category/crime/",
    "https://www.lokmat.com/nagpur/crime/",
  ];

  for (const url of sources) {
    let html = await fetchHtmlAxios(url);
    if (!html) html = await fetchHtmlPuppeteer(url);
    if (!html) continue;

    const $ = cheerio.load(html);

    $("a").each((_, el) => {
      const title = normalize($(el).text());
      const href = $(el).attr("href");

      if (!title || !href) return;
      if (!/crime|हत्या|चोरी|robbery|murder/i.test(title)) return;

      const link = href.startsWith("http") ? href : new URL(href, url).href;

      const cred = credibility(url, 0);

      all.push({
        source: new URL(url).hostname,   // ✅ CLEAN SOURCE
        type: "news",                    // ✅ CONSISTENT FILTER
        text: title,
        fullText: "",
        media: [],
        originalPostUrl: link,
        scrapedAt: new Date(),
        createdAt: new Date(),           // ✅ CRITICAL FIX
        location: {
          city: NAGPUR_CITY,
          state: NAGPUR_STATE,
        },
        category: detectCategory(title),
        ...cred,
        fingerprint: md5(link),
      });
    });
  }

  // ✅ REMOVE DUPLICATES (IN MEMORY)
  const map = new Map();
  for (const item of all) {
    if (!map.has(item.fingerprint)) {
      map.set(item.fingerprint, item);
    }
  }

  const docs = [...map.values()];
  console.log(`✅ Final scraped: ${docs.length}`);

  // ✅ SAVE TO DATABASE
  let inserted = 0;

  for (const doc of docs) {
    const exists = await Post.findOne({ fingerprint: doc.fingerprint });

    if (!exists) {
      await Post.create(doc);
      inserted++;
    }
  }

  console.log(`💾 Inserted: ${inserted}`);

  // ✅ CLOSE BROWSER
  if (browser) {
    await browser.close();
    browser = null;
  }

  return {
    success: true,
    totalFetched: docs.length,
    inserted,
  };
}