// src/config/db.js

import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri, {
      dbName: "spy-socio",

      // ✅ Production-safe options
      autoIndex: config.app.nodeEnv !== "production", // disable in prod
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("🍃 MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// ✅ for worker scripts / cron jobs
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB disconnected");
  } catch (err) {
    console.error("❌ MongoDB disconnect error:", err.message);
  }
};