import React from "react";
import {
  Heart,
  MessageCircle,
  Instagram,
} from "lucide-react";
import "../../../styles/intelligenceCard.css";

export default function InstagramCard({
  post,
  isExpanded,
  onToggleExpand,
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

  const text = post.text || post.fullText || "No content";

  const severity = text.toLowerCase().includes("crime")
    ? "medium"
    : "low";

  /* ===============================
     AI (LIGHT INTEL)
  =============================== */
  const ai = {
    risk: severity.toUpperCase(),
    insight: "Visual social signal detected",
    action: "Monitor engagement pattern",
    confidence: 68,
  };

  return (
    <div
      className={`card ${severity} ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={onToggleExpand}
    >
      {/* MEDIA */}
      <div className="card-img-wrapper">
        {mediaUrl ? (
          isVideo ? (
            <video
              src={mediaUrl}
              className="card-img"
              autoPlay
              loop
              muted
            />
          ) : (
            <img src={mediaUrl} className="card-img" />
          )
        ) : (
          <div className="card-noimg">
            <Instagram size={30} />
          </div>
        )}

        <div className="card-overlay" />

        <div className="card-topbar">
          <div className={`severity-dot ${severity}`} />
          <span className="card-source">INSTAGRAM</span>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="card-title">{text}</h3>

      {/* AI */}
      <div className="card-ai">
        <div className="ai-row">
          <span className={`ai-risk ${ai.risk.toLowerCase()}`}>
            {ai.risk}
          </span>
          <span className="ai-confidence">
            {ai.confidence}%
          </span>
        </div>

        <div className="ai-insight">{ai.insight}</div>
        <div className="ai-action">{ai.action}</div>
      </div>

      {/* META */}
      <div className="card-meta">
        <span>
          ❤️ {post.likesCount || 0}
        </span>
        <span>
          💬 {post.commentsCount || 0}
        </span>
      </div>

      {/* EXPANDED */}
      {isExpanded && (
        <div className="card-expanded">
          <div className="expanded-section">
            <div className="expanded-label">
              FULL CAPTION
            </div>
            <div className="expanded-text">
              {text}
            </div>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="card-actions">
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}