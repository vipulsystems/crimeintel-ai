import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["instagram", "twitter", "reddit", "intelligence", "news"], // ✅ ADD
      required: true,
    },

    title: String, // reddit / intelligence
    text: String, // twitter / captions
    description: String, // fallback

    source: String, // username / subreddit

    media: [
      {
        url: String,
        type: String,
      },
    ],

    externalId: String, // redditId / tweetId etc

    originalPostUrl: String,

    location: {
      city: String,
      state: String,
      country: String,
      lat: Number,
      lng: Number,
    },

    metadata: {
      likes: Number,
      comments: Number,
      shares: Number,
    },

    category: String,
    tags: [String],

    credibilityScore: Number,
    credibility: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "approved",
    },

    raw: mongoose.Schema.Types.Mixed, // store original data safely
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
