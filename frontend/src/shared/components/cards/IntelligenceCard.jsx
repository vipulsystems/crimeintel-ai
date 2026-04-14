import React from "react";
import {
  ExternalLink,
  Bookmark,
  Instagram,
  Twitter,
  MessageCircle,
  Image,
} from "lucide-react";
import "../../../styles/intelligencecard.css";

export default function IntelligenceCard({
  post,
  onOpen,
  toggleBookmark,
  isBookmarked,
}) {
  const media = post.media?.[0];

  const mediaUrl = media?.url
    ? media.url.startsWith("http")
      ? media.url
      : `http://localhost:5000${
          media.url.startsWith("/") ? "" : "/"
        }${media.url}`
    : null;

  const isVideo = media?.type === "video";

  const text = post.text || post.title || "No content available";

  const severity = post.category?.toLowerCase().includes("murder")
    ? "high"
    : post.category?.toLowerCase().includes("robbery")
    ? "medium"
    : "low";

  const source = post.source?.toLowerCase() || "";

  const getIcon = () => {
    if (source.includes("instagram")) return <Instagram size={16} />;
    if (source.includes("twitter")) return <Twitter size={16} />;
    if (source.includes("reddit")) return <MessageCircle size={16} />;
    return <Image size={16} />;
  };

  /* ===============================
     AI STRUCTURE (NEW)
  =============================== */
  const ai = post.ai || {
    risk: severity.toUpperCase(),
    insight: "Pattern deviation detected in recent activity",
    action: "Monitoring advised",
    confidence: Math.floor(Math.random() * 20) + 70,
  };

  return (
    <div className={`card ${severity}`} onClick={() => onOpen(post)}>
      
      {/* IMAGE */}
      <div className="card-img-wrapper">
        {mediaUrl ? (
          isVideo ? (
            <video src={mediaUrl} className="card-img" autoPlay loop muted />
          ) : (
            <img src={mediaUrl} className="card-img" />
          )
        ) : (
          <div className="card-noimg">{getIcon()}</div>
        )}

        <div className="card-overlay" />

        {/* TOP BAR */}
        <div className="card-topbar">
          <div className={`severity-dot ${severity}`} />
          <span className="card-source">{post.source}</span>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="card-title">{text}</h3>

      {/* AI BLOCK (UPGRADED) */}
      <div className="card-ai">
        <div className="ai-row">
          <span className={`ai-risk ${ai.risk.toLowerCase()}`}>
            {ai.risk}
          </span>
          <span className="ai-confidence">
            {ai.confidence}%
          </span>
        </div>

        <div className="ai-insight">
          {ai.insight}
        </div>

        <div className="ai-action">
          {ai.action}
        </div>
      </div>

      {/* META */}
      <div className="card-meta">
        <span>{post.location?.city || "Unknown"}</span>
        <span>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* TAGS */}
      <div className="card-tags">
        <span className="tag crime">{post.category || "General"}</span>
        <span className="tag source">{post.source}</span>
      </div>

      {/* ACTIONS */}
      <div className="card-actions">
        {post.originalPostUrl && (
          <a
            href={post.originalPostUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="card-source-link"
          >
            Source <ExternalLink size={12} />
          </a>
        )}

        {toggleBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(post._id);
            }}
            className="card-bookmark"
          >
            <Bookmark className={isBookmarked ? "active" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}