import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../features/auth/context/AuthContext";
import { io } from "socket.io-client";
import "../../styles/header.css";

const socket = io("http://localhost:5000");

const Header = () => {
  const { user } = useContext(AuthContext);

  const [time, setTime] = useState("");
  const [alerts, setAlerts] = useState([]);

  /* CLOCK */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /* REAL-TIME ALERTS */
  useEffect(() => {
    socket.on("alert", (data) => {
      setAlerts((prev) => [data, ...prev]);
    });

    return () => socket.off("alert");
  }, []);

  return (
    <header className="intel-header">

      {/* LEFT */}
      <div className="intel-left">
        <span className="intel-title">CRIMEINTEL AI</span>
      </div>

      {/* RIGHT */}
      <div className="intel-right">

        {/* 🔴 LIVE ALERT */}
        <div className="intel-alert">
          🚨 {alerts.length}
        </div>

        {/* ROLE */}
        <div className={`intel-role ${user?.role}`}>
          {user?.role?.toUpperCase() || "USER"}
        </div>

        {/* TIME */}
        <div className="intel-time">{time}</div>

        {/* USER */}
        <div className="intel-user">
          <div className="intel-avatar">
            {user?.name?.[0] || "A"}
          </div>

          <div className="intel-user-info">
            <div>{user?.name || "Officer"}</div>
            <span>{user?.email || ""}</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;