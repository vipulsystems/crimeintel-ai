import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import errorHandler  from "./shared/middleware/error.middleware.js";

// ✅ MODULE ROUTES
import authRoutes from "./modules/auth/auth.routes.js";
import postRoutes from "./modules/post/post.routes.js";

// ✅ OTHER ROUTES (keep)
import ingestRoutes from "./modules/ingest/ingest.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import crimeRoutes from "./modules/crime/crime.routes.js";
import bookmarksRoutes from "./modules/bookmark/bookmark.routes.js";
import postExportRoutes from "./modules/post/post.export.route.js";
import imageProxyRoutes from "./shared/routes/imageProxy.route.js";
import userRoutes from "./modules/user/user.routes.js";
import scrapeRoutes from './modules/news/scrape.routes.js';
import redditRoutes from "./modules/social/reddit/reddit.routes.js";

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-ingest-secret"],
    credentials: true,
  })
);

// ✅ MIDDLEWARE
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// ✅ STATIC FILES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// =======================
// ✅ ROUTES (CLEANED)
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);     // 🔥 MAIN API
app.use("/api/crimes", crimeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ingest", ingestRoutes);
app.use("/api/users", userRoutes);

// optional / utility
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/image", imageProxyRoutes);
app.use("/api/export", postExportRoutes);
app.use("/api/scrape", scrapeRoutes);
app.use("/api/reddit", redditRoutes);

app.use(errorHandler);

export default app;