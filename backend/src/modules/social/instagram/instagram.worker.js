// ⚠️ DISABLED: Instagram scraping not allowed currently
// This worker is kept for future use

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const KEYWORDS = [
  "crime", "attack", "theft", "robbery", "police",
  "murder", "kidnap", "abuse", "violence", "drug"
];

// 🔥 MAIN WORKER FUNCTION
export async function scrapeInstagram() {
  const browser = await puppeteer.launch({
    headless: false, // keep false (IG blocks headless)
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1280,800"
    ]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  const TAG_URL = "https://www.instagram.com/explore/tags/crime/";
  console.log("🔎 Opening Instagram:", TAG_URL);

  await page.goto(TAG_URL, { waitUntil: "networkidle2", timeout: 0 });

  try {
    await page.waitForSelector("article", { timeout: 15000 });
  } catch {
    console.log("⚠ Fallback scrolling...");
    await autoScroll(page);
    await page.waitForSelector("article", { timeout: 15000 });
  }

  const postLinks = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll("article a")];
    return anchors
      .map(a => "https://www.instagram.com" + a.getAttribute("href"))
      .slice(0, 10);
  });

  console.log("📌 Found posts:", postLinks.length);

  const results = [];

  for (let link of postLinks) {
    try {
      console.log("🔍 Opening:", link);

      await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });

      await page.waitForSelector("img, video", { timeout: 10000 });

      const data = await page.evaluate(() => {
        const caption = document.querySelector("h1")?.innerText ?? "";

        const mediaNodes = [...document.querySelectorAll("img, video")];

        const media = mediaNodes.map((m) => ({
          url: m.src,
          type: m.tagName.toLowerCase() === "video" ? "video" : "image",
        }));

        return { caption, media };
      });

      const lower = data.caption.toLowerCase();
      const matched = KEYWORDS.filter(k => lower.includes(k));

      if (matched.length === 0) continue;

      // ✅ RETURN DATA (NO API CALL)
      results.push({
        source: "instagram",
        text: data.caption,
        media: data.media,
        originalPostUrl: link,
        keywordsMatched: matched,
        scrapedAt: new Date(),
      });

    } catch (err) {
      console.log("⚠ Error:", err.message);
    }
  }

  await browser.close();

  return results;
}

// 🔁 AUTO SCROLL
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, 600);
        total += 600;

        if (total >= 3000) {
          clearInterval(timer);
          resolve();
        }
      }, 700);
    });
  });
}