import React, { useEffect } from "react";
import {
  X,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Bookmark,
  FileText,
  Share2,
  Image,
} from "lucide-react";
import "../../styles/ArticleModal.css";

export default function ArticleModal({
  post,
  onClose,
  onPrev,
  onNext,
  onBookmark,
  isBookmarked,
}) {
  if (!post) return null;

  const media = post.media?.[0];

  const mediaUrl = media?.url
    ? media.url.startsWith("http")
      ? media.url
      : `http://localhost:5000${
          media.url.startsWith("/") ? "" : "/"
        }${media.url}`
    : null;

  const isVideo = media?.type === "video";

  /* ===============================
     LOCK SCROLL + KEYS
  =============================== */
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);

  /* ===============================
     ACTIONS
  =============================== */
  const handleCopy = () => {
    if (post.originalPostUrl) {
      navigator.clipboard.writeText(post.originalPostUrl);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title || "Post",
        url: post.originalPostUrl,
      });
    } else {
      handleCopy();
    }
  };

  /* ===============================
     SEVERITY (INTEL CONTEXT)
  =============================== */
  const text = post.text || "";
  const severity = text.toLowerCase().includes("murder")
    ? "HIGH"
    : text.toLowerCase().includes("robbery")
    ? "MEDIUM"
    : "LOW";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="modal-top-bar">
          <div className="modal-title-block">
            <h2 className="modal-title">
              {post.title ||
                post.text?.slice(0, 80) ||
                "Post"}
            </h2>

            <div className="modal-sub-meta">
              <span className={`risk ${severity.toLowerCase()}`}>
                {severity}
              </span>

              <span>
                <MapPin size={12} />{" "}
                {post.location?.city || "Unknown"}
              </span>

              <span>
                {post.createdAt
                  ? new Date(
                      post.createdAt
                    ).toLocaleDateString()
                  : "No Date"}
              </span>
            </div>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* ================= SIDE PANEL ================= */}
        <div className="side-menu">
          {onBookmark && (
            <button onClick={() => onBookmark(post._id)}>
              <Bookmark
                size={22}
                className={isBookmarked ? "bookmarked" : ""}
              />
              <span>{isBookmarked ? "Saved" : "Save"}</span>
            </button>
          )}

          <button onClick={handleCopy}>
            <LinkIcon size={22} />
            <span>Copy</span>
          </button>

          <button onClick={handleShare}>
            <Share2 size={22} />
            <span>Share</span>
          </button>

          <a
            href={`/api/reddit/export/${post._id}`}
            target="_blank"
            rel="noreferrer"
          >
            <FileText size={22} />
            <span>Export</span>
          </a>

          {post.originalPostUrl && (
            <a
              href={post.originalPostUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={22} />
              <span>Source</span>
            </a>
          )}
        </div>

        {/* ================= BODY ================= */}
        <div className="modal-scroll">
          {/* MEDIA */}
          <div className="modal-image-container">
            {mediaUrl ? (
              isVideo ? (
                <video
                  src={mediaUrl}
                  className="modal-image"
                  controls
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="post"
                  className="modal-image"
                />
              )
            ) : (
              <div className="modal-no-image">
                <Image size={40} />
                <span>No Media</span>
              </div>
            )}

            {onPrev && (
              <button
                className="modal-arrow left"
                onClick={onPrev}
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {onNext && (
              <button
                className="modal-arrow right"
                onClick={onNext}
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>

          {/* TEXT */}
          <div className="modal-text">
            {post.fullText ||
              post.text ||
              "No description available."}
          </div>
        </div>
      </div>
    </div>
  );
}