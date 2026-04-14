/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Shifted to a deeper, "Classified" Obsidian palette
        darkBg: "#020617", 
        darkCard: "rgba(15, 23, 42, 0.7)", // Translucent for glassmorphism
        neonCyan: "#00F5FF",
        accentBlue: "#38bdf8",
        dangerRed: "#ff2e63",
        // Adding "Data" colors
        gridLine: "rgba(0, 245, 255, 0.05)",
      },
      backgroundImage: {
        // This creates that "Forensic Grid" look automatically
        'forensic-grid': "linear-gradient(to right, rgba(0, 245, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 245, 255, 0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 15px rgba(0, 245, 255, 0.2)",
        "glow-strong": "0 0 35px rgba(0, 245, 255, 0.4)",
        "inner-glow": "inset 0 0 15px rgba(0, 245, 255, 0.1)",
      },
      animation: {
        flicker: "flicker 3s infinite",
        'scanline': 'scan 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        flicker: {
          "0%, 19.9%, 22%, 62.9%, 64%, 100%": { opacity: "1" },
          "20%, 21.9%, 63%": { opacity: "0.6" }, // Subtle flicker is more professional
        },
      },
    },
  },
  plugins: [],
};