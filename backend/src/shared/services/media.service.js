import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 use storage instead of uploads
const STORAGE_DIR = path.join(__dirname, "../../../storage");

// ensure folder exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// allowed extensions (basic safety)
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov"];

/**
 * Download media and store locally
 */
export async function downloadAndSave(url, filenameHint = "media") {
  try {
    if (!url) return null;

    const parsedUrl = new URL(url);
    let ext = path.extname(parsedUrl.pathname).split("?")[0];

    if (!ext || !ALLOWED_EXT.includes(ext.toLowerCase())) {
      ext = ".jpg"; // fallback
    }

    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${filenameHint}${ext}`;

    const filepath = path.join(STORAGE_DIR, filename);

    const response = await axios.get(url, {
      responseType: "stream",
      timeout: 15000,
      maxContentLength: 10 * 1024 * 1024, // 10MB limit
    });

    const writer = fs.createWriteStream(filepath);

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);

      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // served via static route
    return `/storage/${filename}`;
  } catch (err) {
    console.warn("⚠️ media download failed:", err.message);
    return null;
  }
}