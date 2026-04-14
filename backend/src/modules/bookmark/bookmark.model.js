import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, index: true },
    userId: { type: String }, // keep optional (no breaking change)
  },
  {
    timestamps: true,
    collection: "bookmarks", // ✅ rename from reddit_bookmarks
  }
);

export default mongoose.model("Bookmark", bookmarkSchema);