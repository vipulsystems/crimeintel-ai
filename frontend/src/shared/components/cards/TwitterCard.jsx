import React from "react";
import {
  ExternalLink,
  Calendar,
  Twitter,
} from "lucide-react";
import "../../../styles/intelligenceCard.css";

export default function TwitterCard({
  post,
  isExpanded,
  onToggleExpand,
}) {
  const media = post.media?.[0];

  const text = post.text || "No content available";

  const severity = text.toLowerCase().includes("crime")
    ? "medium"
    : "low";

  /* ===============================
     AI STRUCTURE (LIGHT VERSION)
  =============================== */
  const ai = {
    risk: severity.toUpperCase(),
    insight: "Social signal indicates potential anomaly",
    action: "Monitor conversation trend",
    confidence: 65,
  };

  return (
    <div
      className={`card ${severity} ${isExpanded ? "expanded" : ""}`}
      onClick={onToggleExpand}
    >
      {/* IMAGE / MEDIA */}
      <div className="card-img-wrapper">
        {media?.url ? (
          <img src={media.url} className="card-img" />
        ) : (
          <div className="card-noimg">
            <Twitter size={30} />
          </div>
        )}

        <div className="card-overlay" />

        {/* TOP BAR */}
        <div className="card-topbar">
          <div className={`severity-dot ${severity}`} />
          <span className="card-source">TWITTER</span>
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

        <div className="ai-insight">
          {ai.insight}
        </div>

        <div className="ai-action">
          {ai.action}
        </div>
      </div>

      {/* META */}
      <div className="card-meta">
        <span>
          <Calendar size={12} />
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* EXPANDED */}
      {isExpanded && (
        <div className="card-expanded">
          <div className="expanded-section">
            <div className="expanded-label">FULL CONTENT</div>
            <div className="expanded-text">{text}</div>
          </div>
        </div>
      )}

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
            View <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}