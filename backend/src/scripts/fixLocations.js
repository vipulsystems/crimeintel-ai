// backend/src/scripts/fixLocations.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Post from "../modules/post/post.model.js";

async function run() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.");

    console.log("🔧 Fixing missing locations...");

    const defaultCity = process.env.DEFAULT_CITY || "Nagpur";

    const result = await Post.updateMany(
      {
        $or: [
          { location: { $exists: false } },
          { "location.city": { $exists: false } },
          { "location.city": "" }
        ]
      },
      {
        $set: {
          location: { city: defaultCity, state: "Maharashtra" }
        }
      }
    );

    console.log(`✔ Updated ${result.modifiedCount} posts`);
    console.log("🎉 Done!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing locations:", err.message);
    process.exit(1);
  }
}

run();