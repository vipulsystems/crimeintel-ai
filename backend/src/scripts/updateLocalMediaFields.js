import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Post from "../src/modules/post/post.model.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔥 MongoDB Connected");

    const posts = await Post.find({ source: "instagram" });

    let updated = 0;

    for (const p of posts) {
      const id = p._id.toString();

      const jpgPath = `/uploads/instagram/${id}.jpg`;
      const mp4Path = `/uploads/instagram/${id}.mp4`;

      const hasJpg = fs.existsSync(`./uploads/instagram/${id}.jpg`);
      const hasMp4 = fs.existsSync(`./uploads/instagram/${id}.mp4`);

      const update = {};

      if (hasJpg) update["media"] = [{ url: jpgPath, type: "image" }];
      if (hasMp4) update["media"] = [{ url: mp4Path, type: "video" }];

      if (Object.keys(update).length > 0) {
        await Post.findByIdAndUpdate(id, update);
        updated++;
        console.log(`🔹 Updated: ${id}`);
      }
    }

    console.log(`🏁 Finished — Updated ${updated} posts`);
    process.exit();
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  }
};

// ONLY run if executed directly
if (process.argv[1].includes("updateLocalMediaFields")) {
  run();
}