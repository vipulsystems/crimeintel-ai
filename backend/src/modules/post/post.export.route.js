// backend/src/modules/post/post.export.route.js

import express from "express";
import PDFDocument from "pdfkit";
import Post from "./post.model.js";
import axios from "axios";

const router = express.Router();

/**
 * GET /api/posts/export/:id
 */
router.get("/export/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).lean();
    if (!post) return res.status(404).send("Post not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="post-${id}.pdf"`
    );

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    doc.pipe(res);

    // Title
    doc.fontSize(18).text(post.text || "Post", { underline: true });
    doc.moveDown(0.5);

    // Meta
    const dateStr = post.scrapedAt
      ? new Date(post.scrapedAt).toLocaleString()
      : "";

    doc.fontSize(10).text(`Category: ${post.category || "Other"}`, {
      continued: true,
    });
    doc.text(`   Location: ${post.location?.city || "Unknown"}`, {
      continued: true,
    });
    doc.text(`   Date: ${dateStr}`);
    doc.moveDown();

    // Image
    if (post.media?.length > 0 && post.media[0].url) {
      try {
        const imgResp = await axios.get(post.media[0].url, {
          responseType: "arraybuffer",
        });

        const imgBuffer = Buffer.from(imgResp.data, "binary");

        doc.image(imgBuffer, {
          fit: [480, 300],
          align: "center",
        });

        doc.moveDown();
      } catch (e) {
        console.warn("PDF image embed failed:", e.message);
      }
    }

    // Body
    if (post.fullText || post.text) {
      doc.fontSize(12).text(post.fullText || post.text);
      doc.moveDown();
    }

    // Source
    if (post.originalPostUrl) {
      doc
        .fontSize(10)
        .fillColor("blue")
        .text(`Source: ${post.originalPostUrl}`, {
          link: post.originalPostUrl,
          underline: true,
        });
    }

    doc.end();
  } catch (err) {
    next(err);
  }
});

export default router;