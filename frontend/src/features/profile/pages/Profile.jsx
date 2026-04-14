import React, { useState, useEffect, useContext } from "react";
import api from "../../../services/api.js";
import { motion } from "framer-motion";
import {
  Edit3,
  Save,
  Shield,
  Activity,
} from "lucide-react";
import { AuthContext } from "../../auth/context/AuthContext.jsx";
import "../../../styles/profile.css";
import ProfileGeoMap from "../../../shared/components/ProfileGeoMap.jsx";

export default function Profile() {
  const { user: authUser } = useContext(AuthContext);

  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");

  const [stats, setStats] = useState({
    totalLogins: 0,
    lastLogin: null,
    evidenceViews: 0,
    flagsRaised: 0,
    loginLocations: [],
  });

  const [loading, setLoading] = useState(true);

  const isAdmin =
    (user?.role || authUser?.role || "").toLowerCase() === "admin";

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        const u = res.data.user || res.data;

        setUser(u);
        setUpdatedName(u.name || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  /* ================= LOGS ================= */
  useEffect(() => {
    if (!user?._id || !isAdmin) return;

    const fetchLogs = async () => {
      try {
        const res = await api.get(`admin/users/${user._id}/logs`);
        const logs = res.data.logs || res.data || [];

        setStats({
          totalLogins: logs.filter((l) => l.action === "login").length,
          lastLogin:
            logs.filter((l) => l.action === "login").at(-1)?.at || null,
          evidenceViews: logs.filter(
            (l) => l.action === "view_evidence"
          ).length,
          flagsRaised: logs.filter(
            (l) => l.action === "flag_evidence"
          ).length,
          loginLocations: logs
            .filter((l) => l.lat && l.lng)
            .map((l) => ({
              lat: l.lat,
              lng: l.lng,
              city: l.city,
            })),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, [user, isAdmin]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      await api.put("/auth/update", {
        name: updatedName,
        password: updatedPassword || undefined,
      });

      setUser((prev) => ({ ...prev, name: updatedName }));
      setEditMode(false);
      setUpdatedPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  if (loading) return <div>Loading…</div>;

  return (
    <motion.div
      className="profile-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ================= GRID ================= */}
      <div className="profile-main-grid">

        {/* ================= LEFT PANEL ================= */}
        <div className="profile-identity-card">
          <div className="avatar">
            {user.name?.[0]}
          </div>

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <div className="role-badge">
            <Shield size={14} /> {user.role}
          </div>

          {/* EDIT */}
          {editMode ? (
            <>
              <input
                value={updatedName}
                onChange={(e) =>
                  setUpdatedName(e.target.value)
                }
              />

              <input
                type="password"
                value={updatedPassword}
                onChange={(e) =>
                  setUpdatedPassword(e.target.value)
                }
              />

              <button onClick={handleSave}>
                <Save size={14} /> Save
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)}>
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="profile-intel-panel">

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-box">
              <Activity size={16} />
              <span>{stats.totalLogins}</span>
              <p>Logins</p>
            </div>

            <div className="stat-box">
              <span>{stats.evidenceViews}</span>
              <p>Evidence Views</p>
            </div>

            <div className="stat-box">
              <span>{stats.flagsRaised}</span>
              <p>Flags Raised</p>
            </div>
          </div>

          {/* MAP */}
          {stats.loginLocations.length > 0 && (
            <div className="profile-map-card">
              <ProfileGeoMap
                locations={stats.loginLocations}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}