import React from "react";
import "../../styles/skeleton.css";

export default function Skeleton({ type = "card", count = 6 }) {
  const items = Array.from({ length: count });

  const ForensicOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
  );

  if (type === "card") {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className="skeleton-card group">
            <ForensicOverlay />
            {/* The "Media" Placeholder */}
            <div className="skeleton-img shimmer border border-neonCyan/10" />
            
            {/* The "Data" Placeholder */}
            <div className="space-y-3">
              <div className="skeleton-text shimmer border-l-2 border-neonCyan/30" />
              <div className="skeleton-text small shimmer opacity-30" />
            </div>
            
            {/* Corner Accents for Architectural feel */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neonCyan/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neonCyan/40" />
          </div>
        ))}
      </>
    );
  }

  // ... (keep the list logic, but apply the 'shimmer' class)
  return null;
}