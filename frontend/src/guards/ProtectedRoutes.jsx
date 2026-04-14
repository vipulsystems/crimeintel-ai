import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../features/auth/context/AuthContext";

/* -----------------------------------------
   MAIN LOGIN PROTECTION
------------------------------------------ */
export function ProtectedRoutes() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Wait until auth is initialized
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/* -----------------------------------------
   ADMIN-ONLY PROTECTION
------------------------------------------ */
export function ProtectedAdmin() {
  const { role, loading } = useContext(AuthContext);

  console.log("ROLE:", role); // ✅ add this

  if (loading) return <div>Loading...</div>;

  const normalizedRole = role?.toLowerCase().trim();

  if (normalizedRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}