import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "./bookmark.service.js";

/**
 * POST /api/bookmarks
 */
export const createBookmark = async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "postId required" });
    }

    const userId = req.user?.id; // optional

    const bookmark = await addBookmark({ postId, userId });

    res.json({ success: true, bookmark });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/bookmarks/:postId
 */
export const deleteBookmark = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    await removeBookmark({ postId, userId });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookmarks
 */
export const listBookmarks = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const bookmarks = await getBookmarks({ userId });

    res.json({ success: true, bookmarks });
  } catch (err) {
    next(err);
  }
};