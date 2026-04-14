import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "../../../styles/login.css";
import Typed from "typed.js";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const typedRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ===============================
     TYPED TEXT EFFECT
  =============================== */
  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Crime Intelligence Portal",
        "Secure Intelligence Network",
      ],
      typeSpeed: 40,
      backSpeed: 20,
      loop: true,
      showCursor: false,
    });

    return () => typed.destroy();
  }, []);

  /* ===============================
     MATRIX BACKGROUND
  =============================== */
  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters =
      "アァカサタナハマヤャラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const drops = Array.from({ length: columns }).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(2, 6, 23, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#22c55e";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  /* ===============================
     LOGIN HANDLER (FIXED)
  =============================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data?.token) {
        login({
          token: res.data.token,
          role: res.data.role, // ✅ FIXED HERE
        });

        navigate("/dashboard");
      } else {
        setError("Authentication failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="bg-grid" />
      <div className="bg-map" />
      <canvas id="matrixCanvas" className="matrix-canvas"></canvas>

      <motion.div
        className="login-card"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* BRAND */}
        <motion.div className="brand" variants={item}>
          <div className="logo-wrapper">
            <div className="police-avatar">
              <div className="cap"></div>
              <div className="face"></div>
              <div className="badge"></div>
            </div>
            <div className="logo-ring"></div>
          </div>

          <h1 className="title glitch" data-text="SPY-SOCIO">
            SPY-SOCIO
          </h1>

          <p className="subtitle">NAGPUR CITY POLICE</p>

          <p className="typed">
            <span ref={typedRef}></span>
          </p>
        </motion.div>

        {/* ERROR */}
        {error && (
          <motion.div className="error" variants={item}>
            {error}
          </motion.div>
        )}

        {/* FORM */}
        {!loading ? (
          <motion.form onSubmit={handleLogin} variants={container}>
            <motion.div className="input-wrap" variants={item}>
              <input
                type="email"
                placeholder="Official Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div className="input-wrap" variants={item}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Access Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </motion.div>

            <motion.button className="login-btn" variants={item}>
              {loading ? "AUTHENTICATING..." : "ENTER SECURE CONSOLE"}
              <span className="btn-radar" />
            </motion.button>
          </motion.form>
        ) : (
          <div className="loader">
            <div className="ring"></div>
            <p>Securing forensic channel…</p>
          </div>
        )}

        <div className="footer">Authorized personnel only</div>
      </motion.div>
    </div>
  );
};

export default Login;