// backend/src/scripts/checkEnv.js

import dotenv from "dotenv";
dotenv.config();

const REQUIRED_ENV = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "INGEST_SECRET",
];

const OPTIONAL_ENV = [
  "INGEST_ENDPOINT",
  "NEWS_API_KEY",
  "NEWSDATA_API_KEY",
];

const isInvalid = (val) =>
  !val || val.trim() === "" || val.includes("your_");

const missingRequired = REQUIRED_ENV.filter(
  (key) => isInvalid(process.env[key])
);

const missingOptional = OPTIONAL_ENV.filter(
  (key) => isInvalid(process.env[key])
);

if (missingRequired.length) {
  console.error("❌ Missing REQUIRED env vars:", missingRequired);
  process.exit(1);
}

if (missingOptional.length) {
  console.warn("⚠ Missing OPTIONAL env vars:", missingOptional);
}

console.log("✅ Environment looks good.");
process.exit(0);