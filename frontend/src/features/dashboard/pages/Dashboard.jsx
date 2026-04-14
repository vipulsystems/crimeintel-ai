import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../../shared/components/Header";
import Sidebar from "../../../shared/components/Sidebar";
import "../../../styles/dashboard.css";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ✅ AUTO COLLAPSE ON SMALL SCREENS */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-root">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLogout={handleLogout}
      />

      {/* PANEL */}
      <div
        className={`dashboard-panel ${
          isOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {/* HEADER */}
        <Header onLogout={handleLogout} />

        {/* MAIN */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}