import React, { Suspense } from "react";
import Skeleton from "../ui/Skeleton";

export default function PageLoader({ children }) {
  return (
    <Suspense
      fallback={
        <div className="feed-container">
          <Skeleton type="card" count={6} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}