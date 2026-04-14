import express from "express";
import axios from "axios";

const router = express.Router();

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) return false;

    if (
      parsed.hostname === "localhost" ||
      parsed.hostname.startsWith("127.") ||
      parsed.hostname.startsWith("192.168.") ||
      parsed.hostname.startsWith("10.")
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

async function fetchImage(imageUrl) {
  return axios.get(imageUrl, {
    responseType: "stream",
    timeout: 20000,
    maxRedirects: 5,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
      Accept: "image/*,*/*;q=0.8",
      Referer: new URL(imageUrl).origin,
    },
    validateStatus: (status) => status < 500,
  });
}

router.get("/", async (req, res) => {
  try {
    if (!req.query.url) return res.status(400).send("Missing URL");

    const imageUrl = decodeURIComponent(req.query.url);

    if (!isValidUrl(imageUrl)) {
      return res.status(400).send("Invalid URL");
    }

    const response = await fetchImage(imageUrl);
    const contentType = response.headers["content-type"] || "";

    if (!contentType.startsWith("image/")) {
      return res.status(404).end();
    }

    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400");

    response.data.pipe(res);
  } catch (err) {
    console.error("Image proxy error:", err.message);
    res.status(500).end();
  }
});

router.get("/download", async (req, res) => {
  try {
    if (!req.query.url) return res.status(400).send("Missing URL");

    const imageUrl = decodeURIComponent(req.query.url);

    if (!isValidUrl(imageUrl)) {
      return res.status(400).send("Invalid URL");
    }

    const response = await fetchImage(imageUrl);
    const contentType = response.headers["content-type"] || "";

    if (!contentType.startsWith("image/")) {
      return res.status(404).send("Not an image");
    }

    const filename =
      imageUrl.split("/").pop()?.split("?")[0] || "image.jpg";

    res.set("Content-Type", contentType);
    res.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    response.data.pipe(res);
  } catch (err) {
    console.error("Image download error:", err.message);
    res.status(500).send("download failed");
  }
});

export default router;