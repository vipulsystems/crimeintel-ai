import React from "react";
import "../../../styles/intelligenceCard.css";

export default function RedditCard({
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

  const text = post.text || "No content";

  /* ===============================
     SEVERITY LOGIC
  =============================== */
  const severity = text.toLowerCase().includes("murder")
    ? "high"
    : text.toLowerCase().includes("robbery")
    ? "medium"
    : "low";

  /* ===============================
     AI INTEL (SIMULATED)
  =============================== */
  const ai = {
    risk: severity.toUpperCase(),
    insight: "Community-reported signal detected",
    action: "Cross-verify with local sources",
    confidence: 72,
  };

  return (
    <div
      className={`card ${severity} ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={onToggleExpand}
    >
      {/* MEDIA / HEADER */}
      <div className="card-img-wrapper">
        {mediaUrl ? (
          <img src={mediaUrl} className="card-img" />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              opacity: 0.2,
            }}
          >
            🧵
          </div>
        )}

        <div className="card-overlay" />

        <div className="card-topbar">
          <div className={`severity-dot ${severity}`} />
          <span className="card-source">REDDIT</span>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="card-title">{text}</h3>

      {/* AI BLOCK */}
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
        <span>💬 {post.commentsCount || 0}</span>
        <span>
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "N/A"}
        </span>
      </div>

      {/* EXPANDED VIEW */}
      {isExpanded && (
        <div className="card-expanded">
          <div className="expanded-section">
            <div className="expanded-label">
              FULL THREAD
            </div>
            <div className="expanded-text">{text}</div>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="card-actions">
        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          Community Signal
        </span>
      </div>
    </div>
  );
}