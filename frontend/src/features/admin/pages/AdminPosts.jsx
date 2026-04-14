import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import MediaHoverPreview from "../../../shared/components/MediaHoverPreview";
import ArticleModal from "../../../shared/components/ArticleModal";
import { Flag, FlagOff, Trash2 } from "lucide-react";
import "../../../styles/adminPosts.css";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 25;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [hoverMedia, setHoverMedia] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [selectedPost, setSelectedPost] = useState(null);

  /* ===============================
     FETCH
  =============================== */
  useEffect(() => {
    fetchPosts();
  }, [page]);

  async function fetchPosts() {
    try {
      setLoading(true);

      const res = await api.get("/posts", {
        params: { page, limit },
      });

      setPosts(res.data.posts || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Fetch posts failed:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     SEVERITY
  =============================== */
  const getSeverity = (post) => {
    const cat = post.category?.toLowerCase() || "";

    if (cat.includes("murder")) return "high";
    if (cat.includes("robbery")) return "medium";
    return "low";
  };

  /* ===============================
     DELETE
  =============================== */
  async function handleDelete(id) {
    if (!window.confirm("Delete this evidence permanently?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  /* ===============================
     FLAG
  =============================== */
  async function handleFlag(id, flag) {
    try {
      await api.put(`/admin/posts/${id}/flag`, { flag });

      setPosts((p) =>
        p.map((x) =>
          x._id === id ? { ...x, flagged: flag } : x
        )
      );
    } catch (err) {
      console.error("Flag update failed:", err);
    }
  }

  return (
    <div className="admin-evidence-wrapper">

      {/* ================= HEADER ================= */}
      <div className="admin-evidence-header">
        <div>
          <div className="admin-evidence-title">
            EVIDENCE MANAGEMENT
          </div>

          <div className="admin-evidence-sub">
            Classified forensic database — SPY-SOCIO archive
          </div>
        </div>

        <div className="admin-evidence-stats">
          <div className="admin-chip">Records: {total}</div>
          <div className="admin-chip">Page: {page}</div>
          <div className="admin-chip">Per page: {limit}</div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="admin-evidence-table-wrap">
        <table className="admin-evidence-table">

          <thead>
            <tr>
              <th>Time</th>
              <th>Excerpt</th>
              <th>Crime</th>
              <th>City</th>
              <th>Keywords</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((p) => (
              <tr
                key={p._id}
                className={`admin-evidence-row ${getSeverity(p)} ${
                  p.flagged ? "flagged" : ""
                }`}
                onMouseEnter={(e) => {
                  const m = p.media?.[0];
                  if (m) {
                    setHoverMedia(m);
                    setCursorPos({
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }
                }}
                onMouseMove={(e) =>
                  setCursorPos({
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onMouseLeave={() => setHoverMedia(null)}
                onClick={() => setSelectedPost(p)}
              >
                {/* TIME */}
                <td>
                  {p.scrapedAt
                    ? new Date(p.scrapedAt).toLocaleString()
                    : "—"}
                </td>

                {/* TEXT */}
                <td className="admin-evidence-text">
                  {p.text?.slice(0, 180)}
                  {p.text?.length > 180 ? "…" : ""}
                </td>

                {/* CATEGORY */}
                <td>{p.category || "Other"}</td>

                {/* CITY */}
                <td>{p.location?.city || "—"}</td>

                {/* KEYWORDS */}
                <td className="admin-evidence-keywords">
                  {(p.keywordsMatched || []).join(", ")}
                </td>

                {/* ACTIONS */}
                <td
                  onClick={(e) => e.stopPropagation()}
                  className="admin-actions"
                >
                  <button
                    onClick={() =>
                      handleFlag(p._id, !p.flagged)
                    }
                    className={`admin-btn ${
                      p.flagged ? "danger" : ""
                    }`}
                  >
                    {p.flagged ? (
                      <FlagOff size={14} />
                    ) : (
                      <Flag size={14} />
                    )}
                    {p.flagged ? "Unflag" : "Flag"}
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="admin-btn danger"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* EMPTY */}
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-row">
                  No evidence found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="admin-evidence-pagination">
        <span
          className="page-pill"
          onClick={() =>
            page > 1 && setPage(page - 1)
          }
        >
          Prev
        </span>

        <span className="page-pill active">{page}</span>

        <span
          className="page-pill"
          onClick={() =>
            posts.length === limit &&
            setPage(page + 1)
          }
        >
          Next
        </span>
      </div>

      {/* ================= HOVER PREVIEW ================= */}
      {hoverMedia && (
        <MediaHoverPreview
          media={hoverMedia}
          pos={cursorPos}
        />
      )}

      {/* ================= MODAL ================= */}
      {selectedPost && (
        <ArticleModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}