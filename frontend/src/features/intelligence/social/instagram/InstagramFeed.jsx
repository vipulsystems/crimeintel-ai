import React, { useState, useEffect } from "react";
import InstagramCard from "../../../../shared/components/cards/InstagramCard";
import "../../../../styles/intelligenceFeed.css";
import { motion } from "framer-motion";
import { useGetPostsQuery } from "../../../../store/api/postsApi";

export default function InstagramFeed() {
  const [page, setPage] = useState(1);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  /* AUTO CLOSE */
  useEffect(() => {
    if (showDisclaimer) {
      const timer = setTimeout(() => {
        setShowDisclaimer(false);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [showDisclaimer]);

  /* SCROLL LOCK */
  useEffect(() => {
    document.body.style.overflow = showDisclaimer
      ? "hidden"
      : "auto";
  }, [showDisclaimer]);

  const { data, isLoading, error } = useGetPostsQuery({
    page,
    limit: 6,
    params: { type: "instagram" },
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const generatePageNumbers = () => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      {/* OVERLAY */}
      {showDisclaimer && (
        <div className="disclaimer-overlay">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="disclaimer-modal"
          >
            <div className="modal-corner corner-1" />
            <div className="modal-corner corner-2" />
            <div className="modal-corner corner-3" />
            <div className="modal-corner corner-4" />

            <h2 className="disclaimer-title">
              ⚠ SOCIAL INTELLIGENCE WARNING
            </h2>

            <p className="disclaimer-text">
              Instagram content is sourced from public signals.
              <br /><br />
              Data may be incomplete or delayed.
            </p>

            <button
              className="disclaimer-btn"
              onClick={() => setShowDisclaimer(false)}
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}

      <div className="feed-container">
        {!showDisclaimer && (
          <>
            <h2 className="feed-title">
              Instagram Intelligence
            </h2>

            {error && <div className="error">Failed</div>}
            {isLoading && <div className="loading">Loading...</div>}

            <motion.div className="feed-grid" layout>
              {posts.map((p) => (
                <motion.div key={p._id} layout>
                  <InstagramCard
                    post={p}
                    isExpanded={expandedId === p._id}
                    onToggleExpand={() =>
                      setExpandedId((prev) =>
                        prev === p._id ? null : p._id
                      )
                    }
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              {generatePageNumbers().map((num) => (
                <button
                  key={num}
                  className={num === page ? "active" : ""}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}