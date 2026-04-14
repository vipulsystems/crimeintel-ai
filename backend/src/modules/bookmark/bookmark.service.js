import Bookmark from "./bookmark.model.js";

/**
 * Add bookmark (idempotent)
 */
export const addBookmark = async ({ postId, userId }) => {
  const existing = await Bookmark.findOne({ postId, userId });

  if (existing) return existing;

  const bm = await Bookmark.create({ postId, userId });

  return bm;
};

/**
 * Remove bookmark
 */
export const removeBookmark = async ({ postId, userId }) => {
  await Bookmark.deleteOne({ postId, userId });
};

/**
 * Get bookmarks
 */
export const getBookmarks = async ({ userId }) => {
  const query = userId ? { userId } : {};

  const docs = await Bookmark.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return docs;
};