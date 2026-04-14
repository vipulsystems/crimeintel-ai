import React, { useState, useEffect, useRef } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const DashboardHome = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const navigate = useNavigate();
  const intervalRef = useRef(null);

  /* ===============================
     INTELLIGENCE STREAM
  =============================== */
  const intelligenceFeed = [
    "🚨 Surveillance detected unusual spike in cyber fraud cases across Nagpur zones.",
    "📡 Intelligence engine correlating social media chatter with recent theft reports.",
    "🧠 AI module flagged multiple high-risk clusters requiring investigation.",
    "📍 Heatmap indicates increased activity in Dharampeth and Sitabuldi regions.",
    "🔎 Cross-platform monitoring active — Reddit, Twitter, Instagram synchronized.",
    "⚠️ Potential organized crime pattern detected — anomaly score rising.",
    "📊 Behavioral analysis ongoing — pattern deviation exceeds threshold.",
    "🛰️ Real-time scraping engine scanning for emerging threats.",
  ];

  /* ===============================
     MOCK TREND DATA (replace later)
  =============================== */
  const trendData = [
    { name: "Mon", cases: 12 },
    { name: "Tue", cases: 19 },
    { name: "Wed", cases: 8 },
    { name: "Thu", cases: 15 },
    { name: "Fri", cases: 22 },
    { name: "Sat", cases: 18 },
    { name: "Sun", cases: 25 },
  ];

  /* ===============================
     API
  =============================== */
  const fetchStats = async () => {
    try {
      const res = await api.get("/posts/stats");
      setStats(res.data || {});
    } catch (err) {
      console.error("Stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerScrape = async () => {
    setScraping(true);
    try {
      await api.get("/scrape/run");
      setAlerts((p) => ["Scraper started…", ...p]);
      startPolling();
    } catch {
      setAlerts((p) => ["Scraper failed", ...p]);
      setScraping(false);
    }
  };

  const startPolling = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      try {
        const res = await api.get("/scrape/status");

        if (!res.data.running) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setScraping(false);
          fetchStats();

          setAlerts((p) => ["Scraping completed", ...p]);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
  };

  useEffect(() => {
    fetchStats();
    return () => clearInterval(intervalRef.current);
  }, []);

  const categories = stats?.summary?.categories || [];

  if (loading) {
    return <div className="dh-loading">Loading Intelligence…</div>;
  }

  return (
    <div className="dashboard-home">
      {/* ================= HEADER ================= */}
      <div className="dh-top-row">
        <div>
          <h1 className="dh-title">Forensic Intelligence Dashboard</h1>
          <p className="dh-sub">
            Real-time crime analysis — Spy-Socio Intelligence Engine
          </p>
        </div>

        <button
          className="scrape-btn"
          onClick={triggerScrape}
          disabled={scraping}
        >
          {scraping ? "Processing…" : "⚡ Fetch Intelligence"}
        </button>
      </div>

      {/* ================= ALERT TICKER ================= */}
      <div className="alert-ticker">
        <div className="ticker-track">{intelligenceFeed.join("   ✦   ")}</div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="summary-row">
        {[
          ["Total Reports", stats?.summary?.total],
          ["Today", stats?.summary?.today],
          ["This Week", stats?.summary?.week],
          ["This Month", stats?.summary?.month],
        ].map(([label, value], i) => (
          <motion.div
            key={i}
            className="summary-card"
            whileHover={{ scale: 1.05 }}
          >
            <h2>{value || 0}</h2>
            <p>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="charts-grid">
        {/* LINE CHART */}
        <div className="chart-card">
          <h3>Crime Trend Analysis</h3>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="cases"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AREA CHART */}
        <div className="chart-card">
          <h3>Activity Density</h3>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="cases"
                stroke="#3b82f6"
                fill="rgba(59,130,246,0.2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="map-card">
        <h3>Live Crime Map — Nagpur Intelligence Grid</h3>

        <MapContainer
          center={[21.1458, 79.0882]} // Nagpur
          zoom={12}
          className="map-container"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* SAMPLE CRIME POINTS */}
          {[
            { lat: 21.149, lng: 79.08, intensity: 0.9 },
            { lat: 21.13, lng: 79.09, intensity: 0.7 },
            { lat: 21.16, lng: 79.07, intensity: 0.5 },
          ].map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lng]}
              radius={10 + p.intensity * 10}
              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.4,
              }}
            >
              <Popup>Crime intensity: {(p.intensity * 100).toFixed(0)}%</Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* ================= HEATMAP ================= */}
      <div className="heatmap-card">
        <h3>Crime Hotspot Visualization</h3>

        <div className="heatmap-grid">
          {Array.from({ length: 64 }).map((_, i) => {
            const intensity = Math.random();

            return (
              <div
                key={i}
                className="heat-cell"
                style={{
                  opacity: 0.2 + intensity,
                  background: `rgba(255,0,0,${intensity})`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ================= CATEGORY ================= */}
      {!!categories.length && (
        <div className="category-container">
          <h2 className="category-title">Crime Categories</h2>

          <div className="category-grid">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="category-pill"
                onClick={() => navigate(`/feed?category=${cat._id}`)}
              >
                <span>{cat._id}</span>
                <b>{cat.count}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= INTEL PANELS ================= */}
      <div className="intel-panels">
        <div className="intel-card active">📈 Trend Analysis Active</div>
        <div className="intel-card active">📍 Hotspot Mapping Active</div>
        <div className="intel-card active">🔎 Evidence Correlation Active</div>
      </div>
    </div>
  );
};

export default DashboardHome;
