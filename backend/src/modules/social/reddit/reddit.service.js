import axios from "axios";

/* ---------- HELPERS ---------- */

function detectCategory(text = "") {
  const t = text.toLowerCase();

  if (/(murder|stabbed|shot|killed)/.test(t)) return "Murder";
  if (/(robbery|theft|stolen)/.test(t)) return "Robbery";
  if (/(accident|crash|collision)/.test(t)) return "Accident";
  if (/(drug|ganja|cocaine)/.test(t)) return "Narcotics";
  if (/(rape|sexual assault)/.test(t)) return "Sexual offence";
  if (/(kidnap|abduct)/.test(t)) return "Kidnapping";

  return "Other";
}

function isCrimePost(text = "") {
  const keywords = ["murder", "robbery", "theft", "crime", "attack"];
  return keywords.some((k) => text.toLowerCase().includes(k));
}

/* ---------- FETCH ---------- */

async function fetchFromSubreddit(sub, limit) {
  const url = `https://www.reddit.com/r/${sub}/new.json`;

  const res = await axios.get(url, {
    params: { limit },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "application/json",
    },
  });

  return res.data?.data?.children || [];
}

/* ---------- MAIN ---------- */

export const fetchRedditPosts = async ({ limit = 20 } = {}) => {
  const subs = ["IndianCrime", "CrimeNews", "TrueCrimeIndia"];

  let all = [];

  for (const sub of subs) {
    try {
      const data = await fetchFromSubreddit(sub, limit);
      all.push(...data);
    } catch (err) {
      console.log(`❌ ${sub}`, err.message);
    }
  }

  const results = all
    .map((c) => {
      const d = c.data;
      if (!d) return null;

      const text = `${d.title} ${d.selftext || ""}`.trim();

      if (!isCrimePost(text)) return null;

      return {
        source: "reddit",
        type: "reddit",
        text,
        category: detectCategory(text),
        media: [],
        originalPostUrl: `https://reddit.com${d.permalink}`,
        scrapedAt: new Date(d.created_utc * 1000),
        fingerprint: d.id,
      };
    })
    .filter(Boolean);

  return {
    success: true,
    total: results.length,
    data: results,
  };
};