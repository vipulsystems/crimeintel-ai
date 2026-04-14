import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../../styles/dashboard.css";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true); // start open (better UX)
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="dashboard-root">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLogout={handleLogout}
      />

      {/* MAIN PANEL */}
      <div
        className={`dashboard-panel ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {/* HEADER */}
        <Header onLogout={handleLogout} />

        {/* CONTENT */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}