import { useEffect, useState } from "react";
import { getLocalMediaUrl, getProxyImageUrl } from "../../services/media";
import "../../styles/adminPosts.css";

export default function MediaHoverPreview({ media, pos }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (media) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [media]);

  if (!media) return null;

  // Decide source type
  const src = media.url?.startsWith("http")
    ? getProxyImageUrl(media.url)
    : getLocalMediaUrl(media.url);

  return (
    <div
      className="evidence-hover-preview"
      style={{
        top: pos?.y + 12 || 0,
        left: pos?.x + 18 || 0,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      {media.type === "video" ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="preview-media"
        />
      ) : (
        <img src={src} alt="preview" className="preview-media" />
      )}
    </div>
  );
}