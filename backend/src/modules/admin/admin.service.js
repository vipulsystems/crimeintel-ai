import Post from "../post/post.model.js";
import UserLog from "../user/userLog.model.js";

/**
 * Get posts with filters
 */
export const getAdminPosts = async ({ page, limit, city }) => {
  const filters = {};

  if (city) {
    filters["location.city"] = city;
  }

  const skip = (page - 1) * limit;

  const posts = await Post.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments(filters);

  return { posts, total };
};

/**
 * Delete post
 */
export const removePost = async (id) => {
  return Post.findByIdAndDelete(id);
};

/**
 * Flag post
 */
export const updatePostFlag = async (id, flag) => {
  return Post.findByIdAndUpdate(
    id,
    { $set: { flagged: flag ?? true } },
    { new: true }
  );
};

/**
 * Get user logs
 */
export const fetchUserLogs = async (userId) => {
  return UserLog.find({ userId })
    .sort({ at: 1 })
    .lean();
};