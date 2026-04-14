import Post from "../post/post.model.js";
import UserLog from "../user/userLog.model.js";

// ================= POSTS =================

export const listPosts = async (req, res) => {
  try {
    const { page = 1, limit = 50, city } = req.query;

    const filters = {};
    if (city) filters["location.city"] = city;

    const posts = await Post.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(filters);

    return res.json({ success: true, posts, total });
  } catch (err) {
    console.error("admin listPosts", err);
    res.status(500).json({ error: "server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const p = await Post.findByIdAndDelete(req.params.id);

    if (!p) return res.status(404).json({ error: "Not found" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("admin deletePost", err);
    res.status(500).json({ error: "server error" });
  }
};

export const flagPost = async (req, res) => {
  try {
    const { flag } = req.body;

    const p = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { flagged: flag ?? true } },
      { new: true }
    );

    return res.json({ ok: true, post: p });
  } catch (err) {
    console.error("admin flagPost", err);
    res.status(500).json({ error: "server error" });
  }
};

// ================= USER LOGS =================

export const getUserLogs = async (req, res) => {
  try {
    const logs = await UserLog.find({ userId: req.params.id }).sort({ at: 1 });
    res.json(logs);
  } catch (err) {
    console.error("Log fetch error:", err);
    res.status(500).json({ message: "Could not fetch user logs" });
  }
};