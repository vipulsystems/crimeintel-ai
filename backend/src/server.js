import http from "http";
import cron from "node-cron";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";
import { runScraperJob } from "./modules/news/scraper.job.js";

const server = http.createServer(app);

/* 🔥 SOCKET.IO SETUP */
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL later
  },
});

/* 🔥 CONNECTION */
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/* 🔥 EXPORT IO (IMPORTANT) */
export { io };

const startServer = async () => {
  try {
    await connectDB();

    server.listen(config.app.port, () => {
      console.log(
        `🚀 Server running on ${config.app.baseUrl} (env: ${config.app.nodeEnv})`
      );
    });

    /* 🔥 CRON JOB */
    if (process.env.ENABLE_SCRAPER_CRON === "true") {
      const schedule = process.env.SCRAPER_CRON || "0 */6 * * *";

      console.log("⏰ Starting scraper cron:", schedule);

      cron.schedule(schedule, async () => {
        try {
          await runScraperJob();

          /* 🔥 EMIT EVENT AFTER SCRAPE */
          io.emit("alert", {
            message: "Scraping completed",
            type: "success",
          });

        } catch (err) {
          console.error("❌ Scraper job failed:", err.message);

          io.emit("alert", {
            message: "Scraper failed",
            type: "error",
          });
        }
      });
    }
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  }
};

startServer();