import Post from "../post/post.model.js";

/**
 * Normalize and store incoming data
 */
export const ingestPostService = async (data) => {
  if (!data.text && !data.title) {
    throw new Error("Text or title required");
  }

  const post = await Post.create({
    type: data.type || "intelligence",

    title: data.title || "",
    text: data.text || "",
    fullText: data.fullText || "",

    media: data.media || [],

    location: data.location || {},

    category: data.category || "Other",

    source: data.source || "manual",

    originalPostUrl: data.originalPostUrl || "",

    keywordsMatched: data.keywordsMatched || [],

    postedAt: data.postedAt || new Date(),
    scrapedAt: new Date(),

    isStatic: data.isStatic ?? false,
  });

  return post;
};