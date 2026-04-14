import Post from "./post.model.js";
import axios from "axios";
import * as cheerio from "cheerio";
/**
 * Build Mongo filters from query params
 */
export const buildPostFilters = (query) => {
  const {
    q,
    city,
    state,
    category,
    type,
    startDate,
    endDate,
    source, // ✅ ADD THIS
  } = query;

  const filters = {};

  // ✅ SOURCE FILTER (THIS FIXES EVERYTHING)
  if (source) {
    filters.source = source.toLowerCase();
  }

  // 🔍 SEARCH
  if (q) {
    filters.$or = [
      { text: { $regex: q, $options: "i" } },
      { title: { $regex: q, $options: "i" } },
      { fullText: { $regex: q, $options: "i" } },
    ];
  }

  // 📍 LOCATION
  if (city) filters["location.city"] = { $regex: city, $options: "i" };
  if (state) filters["location.state"] = { $regex: state, $options: "i" };

  // 🏷 CATEGORY
  if (category) filters.category = category;

  // 🔥 TYPE
  if (type) filters.type = type;

  // 📅 DATE
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  return filters;
};

/**
 * Fetch paginated posts
 */
export const fetchPosts = async ({ filters, page, limit }) => {
  const skip = (page - 1) * limit;

  const posts = await Post.aggregate([
    { $match: filters },
    {
      $addFields: {
        hasMedia: {
          $cond: [
            {
              $and: [{ $isArray: "$media" }, { $gt: [{ $size: "$media" }, 0] }],
            },
            1,
            0,
          ],
        },
      },
    },
    { $sort: { hasMedia: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await Post.countDocuments(filters);

  return { posts, total };
};

/**
 * Fetch single post
 */
export const fetchPostById = async (id) => {
  return Post.findById(id).lean();
};

/**
 * Fetch stats
 */
export const fetchPostStats = async () => {
  const [total, byCategory, byType, daily] = await Promise.all([
    Post.countDocuments(),

    Post.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),

    Post.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),

    Post.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          safeDate: {
            $convert: {
              input: "$createdAt",
              to: "date",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $match: {
          safeDate: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$safeDate",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return { total, byCategory, byType, daily };
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Fetch missing images for posts
 */
export const fetchMissingImages = async (limit = 50) => {
  console.log("🖼️ Fetching missing images...");

  const posts = await Post.find({
    $or: [{ "media.0": { $exists: false } }, { media: { $size: 0 } }],
    originalPostUrl: { $exists: true },
  })
    .limit(limit)
    .lean();

  console.log(`🔍 Posts missing media: ${posts.length}`);

  for (const post of posts) {
    try {
      const { data } = await axios.get(post.originalPostUrl, {
        timeout: 15000,
      });

      const $ = cheerio.load(data);

      const img =
        $("meta[property='og:image']").attr("content") ||
        $("meta[name='twitter:image']").attr("content");

      if (img) {
        await Post.updateOne(
          { _id: post._id },
          { $set: { media: [{ url: img, type: "image" }] } },
        );

        console.log(`🟢 Image saved for ${post._id}`);
      }

      await delay(2000);
    } catch (err) {
      console.log(`🔴 Image fetch failed: ${err.message}`);
    }
  }

  console.log("🖼️ Image fetch completed");
};

export const saveScrapedPosts = async (posts = []) => {
  try {
    let saved = 0;

    for (const post of posts) {
      const exists = await Post.findOne({
        $or: [
          { fingerprint: post.fingerprint },
          { originalPostUrl: post.originalPostUrl },
        ],
      });

      if (!exists) {
        await Post.create(post);
        saved++;
      }
    }

    return { saved };
  } catch (err) {
    console.error("❌ saveScrapedPosts error:", err.message);
    return { saved: 0 };
  }
};