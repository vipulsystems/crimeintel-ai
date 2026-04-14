import React, { useState, useEffect } from "react";
import TwitterCard from "../../../../shared/components/cards/TwitterCard";
import "../../../../styles/intelligenceFeed.css";
import { motion } from "framer-motion";
import { useGetPostsQuery } from "../../../../store/api/postsApi";

export default function TwitterFeed() {
  const [page, setPage] = useState(1);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  /* ===============================
     AUTO CLOSE (4.5s)
  =============================== */
  useEffect(() => {
    if (showDisclaimer) {
      const timer = setTimeout(() => {
        setShowDisclaimer(false);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [showDisclaimer]);

  /* ===============================
     SCROLL LOCK (important)
  =============================== */
  useEffect(() => {
    if (showDisclaimer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showDisclaimer]);

  /* ===============================
     API
  =============================== */
  const { data, isLoading, error } = useGetPostsQuery({
    page,
    limit: 6,
    params: { type: "twitter" },
  });

  const tweets = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  /* ===============================
     PAGINATION
  =============================== */
  const generatePageNumbers = () => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      {/* 🔥 FULL SCREEN OVERLAY (FIXED POSITION) */}
      {showDisclaimer && (
        <div className="disclaimer-overlay">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="disclaimer-modal"
          >
            {/* CYBER CORNERS */}
            <div className="modal-corner corner-1" />
            <div className="modal-corner corner-2" />
            <div className="modal-corner corner-3" />
            <div className="modal-corner corner-4" />

            <h2 className="disclaimer-title">
              ⚠ SOCIAL INTELLIGENCE WARNING
            </h2>

            <p className="disclaimer-text">
              This module displays publicly available social media signals.
              <br /><br />
              Data may be incomplete, delayed, or restricted by platform policies.
              <br /><br />
              Use for analytical and monitoring purposes only.
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

      {/* ===============================
         MAIN FEED
      =============================== */}
      <div className="feed-container">
        {!showDisclaimer && (
          <>
            <h2 className="feed-title">Twitter Intelligence</h2>

            {error && <div className="error">Failed to load tweets</div>}
            {isLoading && <div className="loading">Loading...</div>}

            {!isLoading && tweets.length === 0 && (
              <div className="empty">No tweets found</div>
            )}

            <motion.div className="feed-grid" layout>
              {tweets.map((t) => (
                <motion.div key={t._id} layout>
                  <TwitterCard
                    post={t}
                    isExpanded={expandedId === t._id}
                    onToggleExpand={() =>
                      setExpandedId((prev) =>
                        prev === t._id ? null : t._id
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