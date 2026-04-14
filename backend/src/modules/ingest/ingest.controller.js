import { ingestPostService } from "./ingest.service.js";

/**
 * POST /api/ingest
 */
export const ingestPost = async (req, res) => {
  try {
    const post = await ingestPostService(req.body);

    return res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error("Ingest error:", err);

    return res.status(400).json({
      success: false,
      message: err.message || "Ingest failed",
    });
  }
};