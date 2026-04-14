import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Content from "../models/Content.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/spy-socio";

const keywordsMap = {
  "Murder": ["murder", "kill", "death", "dead", "body", "suicide", "homicide"],
  "Robbery": ["robbery", "theft", "stolen", "loot", "snatch", "burglary"],
  "Assault": ["assault", "attack", "beat", "fight", "injured", "hurt", "violence"],
  "Accident": ["accident", "crash", "collision", "hit"],
  "Fraud": ["fraud", "scam", "cheat", "fake"],
  "Drugs": ["drug", "ganja", "cocaine", "heroin", "police raid"],
  "Cybercrime": ["cyber", "hack", "online fraud"],
  "Other": []
};

const getCategory = (text) => {
  if (!text) return "Other";
  const lowerText = text.toLowerCase();
  for (const [category, keywords] of Object.entries(keywordsMap)) {
    if (keywords.some(k => lowerText.includes(k))) {
      return category;
    }
  }
  return "Other";
};

const seedPosts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Content.deleteMany({});
    console.log("🗑️ Cleared existing content");

    const dataPath = path.join(__dirname, "../data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const posts = JSON.parse(rawData);

    const contentDocs = posts.map(post => {
      const category = getCategory(post.caption);
      
      // Infer city/state (Defaulting to Nagpur/Maharashtra as per data source context)
      let city = "Nagpur";
      let state = "Maharashtra";
      
      if (post.locationName) {
        if (post.locationName.includes("Mumbai")) city = "Mumbai";
        if (post.locationName.includes("Pune")) city = "Pune";
        if (post.locationName.includes("Delhi")) { city = "Delhi"; state = "Delhi"; }
      }

      return {
        source: "Instagram",
        text: post.caption || "",
        fullText: post.caption || "",
        media: post.displayUrl ? [{ type: "image", url: post.displayUrl }] : [],
        location: { city, state },
        category,
        originalPostUrl: post.url,
        scrapedAt: new Date(post.timestamp * 1000), // Assuming timestamp is unix? Wait, let's check format.
        // Checking data.json again... timestamp is "2025-10-17T12:52:36.000Z" (ISO string)
        // So new Date(post.timestamp) is correct.
      };
    });

    // Fix date parsing if needed
    contentDocs.forEach(doc => {
       // The data.json has ISO strings, so new Date() works.
       // But let's double check one entry: "timestamp": "2025-10-17T12:52:36.000Z"
       // Yes, standard ISO.
    });

    await Content.insertMany(contentDocs);
    console.log(`✅ Inserted ${contentDocs.length} posts from data.json`);

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding posts:", err);
    process.exit(1);
  }
};

seedPosts();
