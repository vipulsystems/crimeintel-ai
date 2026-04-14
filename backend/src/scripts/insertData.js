import mongoose from "mongoose";
import fs from "fs";
import InstagramPost from "./models/InstagramPost.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/spy-socio";

async function insertData() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const json = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

  let postsToInsert = [];

  json.forEach((profile) => {
    if (!profile.latestPosts) return;
    profile.latestPosts.forEach((p) => {
      postsToInsert.push({
        caption: p.caption || "",
        displayUrl: p.displayUrl || null,
        videoUrl: p.videoUrl || null,
        media: [p.displayUrl || p.videoUrl].filter(Boolean),
        postUrl: p.url,
        timestamp: p.timestamp ? new Date(p.timestamp) : new Date(),
        locationName: p.locationName || null,
        ownerUsername: p.ownerUsername,
        likesCount: p.likesCount || 0,
        commentsCount: p.commentsCount || 0,
      });
    });
  });

  if (postsToInsert.length === 0) {
    console.log("⚠ No posts found in JSON");
  } else {
    await InstagramPost.insertMany(postsToInsert);
    console.log(`✅ Inserted ${postsToInsert.length} Instagram posts`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
}

insertData().catch(console.error);
