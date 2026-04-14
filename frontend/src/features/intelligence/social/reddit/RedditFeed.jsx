import React, { useState, useEffect } from "react";
import {
  useGetPostsQuery,
  useRunRedditMutation,
} from "../../../../store/api/postsApi";

import RedditCard from "../../../../shared/components/cards/RedditCard";
import "../../../../styles/intelligenceFeed.css";
import { motion } from "framer-motion";

export default function RedditFeed() {
  const [page, setPage] = useState(1);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [filters, setFilters] = useState({
    city: "Nagpur",
    category: "",
    q: "",
  });

  /* ===============================
     AUTO CLOSE DISCLAIMER
  =============================== */
  useEffect(() => {
    if (showDisclaimer) {
      const timer = setTimeout(() => {
        setShowDisclaimer(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showDisclaimer]);

  /* ===============================
     SCROLL LOCK
  =============================== */
  useEffect(() => {
    document.body.style.overflow = showDisclaimer
      ? "hidden"
      : "auto";
  }, [showDisclaimer]);

  /* ===============================
     API
  =============================== */
  const { data, isLoading, error } = useGetPostsQuery({
    page,
    limit: 6,
    params: { ...filters, type: "reddit" },
  });

  const [runReddit, { isLoading: scraping }] =
    useRunRedditMutation();

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  /* ===============================
     PAGINATION
  =============================== */
  const generatePageNumbers = () => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  /* ===============================
     SCRAPER
  =============================== */
  const handleScrape = async () => {
    try {
      await runReddit();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* 🔥 OVERLAY */}
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
              ⚠ COMMUNITY INTELLIGENCE WARNING
            </h2>

            <p className="disclaimer-text">
              Reddit signals are crowd-sourced and may be unverified.
              <br /><br />
              Validate before operational decisions.
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
         FEED
      =============================== */}
      <div className="feed-container">
        {!showDisclaimer && (
          <>
            {/* HEADER */}
            <div className="feed-header">
              <h2 className="feed-title">
                Reddit Intelligence
              </h2>

              <input
                className="search-bar"
                placeholder="Search signals..."
                value={filters.q}
                onChange={(e) =>
                  setFilters({ ...filters, q: e.target.value })
                }
              />
            </div>

            {/* FILTERS */}
            <div className="filters-row">
              <select
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
              >
                <option>Nagpur</option>
                <option>Mumbai</option>
                <option>Pune</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value,
                  })
                }
              >
                <option value="">All</option>
                <option>Murder</option>
                <option>Robbery</option>
              </select>

              <button
                className="apply-btn"
                onClick={() => setPage(1)}
              >
                Apply
              </button>

              <button
                className="apply-btn"
                onClick={handleScrape}
                disabled={scraping}
              >
                {scraping ? "Syncing…" : "Sync Reddit"}
              </button>
            </div>

            {/* STATES */}
            {error && <div className="error">Failed</div>}
            {isLoading && <div className="loading">Loading...</div>}

            {!isLoading && posts.length === 0 && (
              <div className="empty">No signals found</div>
            )}

            {/* GRID */}
            <motion.div className="feed-grid" layout>
              {posts.map((p) => (
                <motion.div key={p._id} layout>
                  <RedditCard
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