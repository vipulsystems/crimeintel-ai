// backend/src/scripts/exportData.js

import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Post from "../modules/post/post.model.js";

dotenv.config();

async function exportData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🍃 MongoDB connected");

    const data = await Post.find({}).lean();

    fs.writeFileSync(
      "posts_export.json",
      JSON.stringify(data, null, 2)
    );

    console.log(`✅ Exported ${data.length} posts`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Export failed:", err.message);
    process.exit(1);
  }
}

exportData();