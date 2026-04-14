import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  UserPlus,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Lock,
  Mail,
  BadgeCheck,
  UserCog,
  Clock,
  MapPin,
  Phone,
  Calendar,
  X,
} from "lucide-react";
import "../../../styles/adminUsers.css";

// helper
function getInitials(name = "", email = "") {
  if (name.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (email[0] || "U").toUpperCase();
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [addModal, setAddModal] = useState(false);
  const [resetModal, setResetModal] = useState(null);
  const [resetPassword, setResetPassword] = useState("");

  const [detailsUser, setDetailsUser] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleResetPassword = async () => {
    await api.put(`/admin/users/${resetModal}/reset`, {
      password: resetPassword,
    });

    setResetModal(null);
    setResetPassword("");
  };

  const openDetails = async (user) => {
    setDetailsUser(user);

    const res = await api.get(`/admin/users/${user._id}/logs`);
    setLogs(res.data.logs || []);
  };

  const filteredUsers = users.filter((u) => {
    const t = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(t) ||
      u.email?.toLowerCase().includes(t)
    ) && (filterRole === "all" || u.role === filterRole);
  });

  return (
    <div className="au-wrapper">

      {/* HEADER */}
      <div className="au-header">
        <div>
          <h1 className="au-title">Admin — User Management</h1>
          <p className="au-sub">Control system users</p>
        </div>

        <div className="au-actions">
          <button className="au-btn" onClick={() => setAddModal(true)}>
            <UserPlus size={16} /> Add
          </button>

          <button className="au-icon-btn" onClick={fetchUsers}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="au-filters">
        <input
          className="au-filter-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="au-filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="officer">Officer</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="au-table-wrap">
        {loading ? (
          <p className="au-loader">Loading...</p>
        ) : (
          <table className="au-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="au-user-cell">
                      <div className="au-avatar">
                        {getInitials(user.name, user.email)}
                      </div>
                      <div>{user.name}</div>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className={`au-role au-role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.active ? (
                      <span className="au-status-active">
                        <ShieldCheck size={14} /> Active
                      </span>
                    ) : (
                      <span className="au-status-inactive">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="au-actions-col">
                    <button onClick={() => openDetails(user)}>
                      <UserCog size={16} />
                    </button>

                    <button onClick={() => setResetModal(user._id)}>
                      <Lock size={16} />
                    </button>

                    <button onClick={() => handleDelete(user._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* RESET PASSWORD */}
      {resetModal && (
        <div className="au-modal-overlay">
          <div className="au-modal">
            <h3>Reset Password</h3>

            <input
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="New password"
            />

            <button onClick={handleResetPassword}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* DRAWER */}
      {detailsUser && (
        <div className="au-drawer-overlay">
          <div className="au-drawer">

            <div className="au-drawer-header">
              <h3>{detailsUser.name}</h3>
              <button onClick={() => setDetailsUser(null)}>
                <X />
              </button>
            </div>

            <div className="au-drawer-body">
              <h4>Activity Logs</h4>

              {logs.length === 0 ? (
                <p>No logs</p>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className="au-log-item">
                    <Clock size={14} />
                    {l.action}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}