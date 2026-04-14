// src/config/env.js

import dotenv from "dotenv";

dotenv.config();

// 🔒 helper to enforce required vars
const required = (key) => {
  const value = process.env[key];
  if (!value || value.includes("your_")) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
  return value;
};

export const config = {
  app: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    baseUrl: process.env.BASE_URL || "http://localhost:5000",
  },

  db: {
    uri: required("MONGO_URI"),
  },

  auth: {
    jwtSecret: required("JWT_SECRET"),
  },

  ingest: {
    endpoint: required("INGEST_ENDPOINT"),
    secret: required("INGEST_SECRET"),
  },

  apis: {
    newsApiKey: process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || "",
    newsDataApiKey: process.env.NEWSDATA_API_KEY || "",
    bingKey: process.env.BING_KEY || "",
    bingEndpoint: process.env.BING_ENDPOINT || "",
  },

  scraper: {
    defaultCity: process.env.DEFAULT_CITY || "Nagpur",
    intervalMinutes: Number(process.env.SCRAPE_INTERVAL_MINUTES) || 10,
  },

  features: {
    twitter: process.env.ENABLE_TWITTER === "true",
    reddit: process.env.ENABLE_REDDIT === "true",
    instagram: process.env.ENABLE_INSTAGRAM === "true",
  },
};