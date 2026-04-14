import {
  getAdminPosts,
  removePost,
  updatePostFlag,
  fetchUserLogs,
} from "./admin.service.js";
import { getUsers } from "../user/user.controller.js";

// ================= POSTS =================

export const listPosts = async (req, res) => {
  try {
    const { page = 1, limit = 50, city } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const { posts, total } = await getAdminPosts({
      page: pageNum,
      limit: limitNum,
      city,
    });

    return res.json({
      success: true,
      posts,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    console.error("admin listPosts", err);
    res.status(500).json({ error: "server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await removePost(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("admin deletePost", err);
    res.status(500).json({ error: "server error" });
  }
};

export const flagPost = async (req, res) => {
  try {
    const { flag } = req.body;

    const post = await updatePostFlag(req.params.id, flag);

    return res.json({
      success: true,
      post,
    });
  } catch (err) {
    console.error("admin flagPost", err);
    res.status(500).json({ error: "server error" });
  }
};

// ================= USER LOGS =================

export const getUserLogs = async (req, res) => {
  try {
    const logs = await fetchUserLogs(req.params.id);

    return res.json({
      success: true,
      logs,
    });
  } catch (err) {
    console.error("Log fetch error:", err);
    res.status(500).json({ message: "Could not fetch user logs" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const { users, total } = await getUsers({
      page: Number(page),
      limit: Number(limit),
    });

    return res.json({
      success: true,
      users,
      total,
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ error: "server error" });
  }
};