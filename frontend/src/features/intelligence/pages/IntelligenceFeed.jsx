import React, { useState } from "react";
import { useGetPostsQuery } from "../../../store/api/postsApi";
import { motion } from "framer-motion";

import InstagramCard from "../../../shared/components/cards/InstagramCard";
import TwitterCard from "../../../shared/components/cards/TwitterCard";
import RedditCard from "../../../shared/components/cards/RedditCard";
import IntelligenceCard from "../../../shared/components/cards/IntelligenceCard";

import ArticleModal from "../../../shared/components/ArticleModal";
import "../../../styles/intelligenceFeed.css";

export default function IntelligenceFeed() {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    city: "Nagpur",
    category: "",
    q: "",
  });

  const [selectedPost, setSelectedPost] = useState(null);

  const { data, isLoading, error } = useGetPostsQuery({
    page,
    limit: 9,
    params: filters,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  /* ===============================
     CARD SWITCH (CLEANED)
  =============================== */
  const renderCard = (post) => {
    const commonProps = {
      post,
      onOpen: setSelectedPost, // cleaner
    };

    switch (post.type) {
      case "instagram":
        return <InstagramCard {...commonProps} />;
      case "twitter":
        return <TwitterCard {...commonProps} />;
      case "reddit":
        return <RedditCard {...commonProps} />;
      default:
        return <IntelligenceCard {...commonProps} />;
    }
  };

  /* ===============================
     PAGINATION
  =============================== */
  const generatePageNumbers = () => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="feed-container">

      {/* HEADER */}
      <div className="feed-header">
        <h2 className="feed-title">Intelligence Feed</h2>
        <p className="feed-sub">
          Live monitoring across intelligence sources
        </p>
      </div>

      {/* CONTROLS */}
      <div className="feed-controls">
        <input
          className="search-bar"
          placeholder="Search intelligence logs..."
          value={filters.q}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, q: e.target.value }))
          }
        />

        <div className="filters-row">
          <select
            value={filters.city}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, city: e.target.value }))
            }
          >
            <option>Nagpur</option>
            <option>Mumbai</option>
            <option>Pune</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="">All Categories</option>
            <option>Murder</option>
            <option>Robbery</option>
          </select>

          <button
            className="apply-btn"
            onClick={() => setPage(1)}
          >
            Apply
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error">
          Failed to load intelligence
        </div>
      )}

      {/* GRID */}
      <motion.div
        className="feed-grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.05, // tighter + faster
            },
          },
        }}
      >
        {posts.map((post) => (
          <motion.div
            key={post._id}
            className="feed-card-wrap"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
          >
            {renderCard(post)}
          </motion.div>
        ))}
      </motion.div>

      {/* LOADING */}
      {isLoading && (
        <div className="loading">
          Loading intelligence…
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && posts.length === 0 && (
        <div className="empty">
          No intelligence data found
        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Prev
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
          Next →
        </button>
      </div>

      {/* MODAL */}
      {selectedPost && (
        <ArticleModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}