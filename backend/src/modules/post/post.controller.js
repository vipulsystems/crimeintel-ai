import Post from "./post.model.js";

/**
 * GET /api/posts
 * supports:
 * q, city, state, category, type, page, limit, startDate, endDate
 */
export const getPosts = async (req, res) => {
  try {
    const {
      q,
      city,
      state,
      category,
      type,
      page = 1,
      limit = 12,
      startDate,
      endDate,
    } = req.query;

    const filters = {};

    // 🔍 SEARCH (optimized fallback-safe)
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

    // 🔥 TYPE FILTER
    // 🔥 PLATFORM / SOURCE FILTER (FIXED)
    if (type) {
      filters.source = { $regex: type, $options: "i" };
    }

    // 📅 DATE FILTER (use createdAt consistently)
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // 🔥 MAIN QUERY (aggregation for sorting + media priority)
    const posts = await Post.aggregate([
      { $match: filters },

      // prioritize posts with media
      {
        $addFields: {
          hasMedia: {
            $cond: [
              {
                $and: [
                  { $isArray: "$media" },
                  { $gt: [{ $size: "$media" }, 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },

      { $sort: { hasMedia: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNum },
    ]);

    const total = await Post.countDocuments(filters);

    return res.json({
      success: true,
      posts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
    });
  }
};

/** GET /api/posts/:id */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.json({ success: true, post });
  } catch (err) {
    console.error("Error fetching post:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching post",
    });
  }
};

/** GET /api/posts/stats */
export const getPostStats = async (req, res) => {
  try {
    // 🕒 Date ranges
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date();
    startOfMonth.setMonth(now.getMonth() - 1);

    // ✅ TOTAL
    const total = await Post.countDocuments();

    // ✅ CATEGORY
    const byCategory = await Post.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // ✅ TYPE / SOURCE
    const byType = await Post.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);

    // ✅ SAFE DATE PIPELINE (REUSABLE)
    const safeDateStage = [
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
    ];

    // ✅ DAILY STATS
    const daily = await Post.aggregate([
      ...safeDateStage,
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
    ]);

    // ✅ TODAY
    const today = await Post.aggregate([
      ...safeDateStage,
      {
        $match: {
          safeDate: { $gte: startOfToday },
        },
      },
      { $count: "count" },
    ]);

    // ✅ WEEK
    const week = await Post.aggregate([
      ...safeDateStage,
      {
        $match: {
          safeDate: { $gte: startOfWeek },
        },
      },
      { $count: "count" },
    ]);

    // ✅ MONTH
    const month = await Post.aggregate([
      ...safeDateStage,
      {
        $match: {
          safeDate: { $gte: startOfMonth },
        },
      },
      { $count: "count" },
    ]);

    // ✅ TOP CITIES
    const topCities = await Post.aggregate([
      {
        $match: {
          "location.city": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$location.city",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return res.json({
      success: true,
      summary: {
        total,
        today: today[0]?.count || 0,
        week: week[0]?.count || 0,
        month: month[0]?.count || 0,
        categories: byCategory,
        types: byType,
        topCities,
      },
      dailyStats: daily,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};