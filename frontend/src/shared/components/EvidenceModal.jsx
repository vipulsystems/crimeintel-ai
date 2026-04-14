import React, { useEffect } from "react";
import {
  X,
  Trash2,
  Flag,
  Link as LinkIcon,
  Clock,
  MapPin,
  Shield,
} from "lucide-react";
import { getProxyImageUrl } from "../../services/media";
import "../../styles/evidenceModal.css";

export default function EvidenceModal({
  post,
  onClose,
  onDelete,
  onFlag,
}) {
  if (!post) return null;

  const media = post.media?.[0];
  const isVideo = media?.type === "video";

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const severity =
    post.category?.toLowerCase().includes("murder")
      ? "high"
      : post.category?.toLowerCase().includes("robbery")
      ? "medium"
      : "low";

  return (
    <div className="evidence-overlay" onClick={onClose}>
      <div
        className="evidence-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="evidence-header">
          <div>
            <h2>Evidence Record</h2>
            <div className="evidence-meta">
              <span className={`risk ${severity}`}>
                {severity.toUpperCase()}
              </span>

              <span>
                <Clock size={12} />{" "}
                {post.scrapedAt
                  ? new Date(post.scrapedAt).toLocaleString()
                  : "Unknown"}
              </span>

              {post.location && (
                <span>
                  <MapPin size={12} />{" "}
                  {post.location.city || "Unknown"}
                </span>
              )}
            </div>
          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="evidence-body">

          {/* MEDIA */}
          <div className="evidence-media">
            {media ? (
              isVideo ? (
                <video
                  src={media.url}
                  controls
                />
              ) : (
                <img
                  src={getProxyImageUrl(media.url)}
                  alt="Evidence"
                />
              )
            ) : (
              <div className="no-media">
                <Shield size={20} />
                <span>No Media</span>
              </div>
            )}
          </div>

          {/* CATEGORY */}
          <div className="evidence-tags">
            {post.category && (
              <span className="tag">
                {post.category}
              </span>
            )}

            {post.flagged && (
              <span className="tag flagged">
                Flagged
              </span>
            )}
          </div>

          {/* TEXT */}
          <div className="evidence-text">
            {post.fullText ||
              post.text ||
              "No content available."}
          </div>

          {/* SOURCE */}
          {post.originalPostUrl && (
            <a
              href={post.originalPostUrl}
              target="_blank"
              rel="noreferrer"
              className="evidence-source"
            >
              <LinkIcon size={12} /> Open Source
            </a>
          )}

          {/* ACTIONS */}
          <div className="evidence-actions">
            {onFlag && (
              <button
                onClick={() =>
                  onFlag(post._id, !post.flagged)
                }
              >
                <Flag size={14} />
                {post.flagged ? "Unflag" : "Flag"}
              </button>
            )}

            {onDelete && (
              <button
                className="danger"
                onClick={() => {
                  onDelete(post._id);
                  onClose();
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}