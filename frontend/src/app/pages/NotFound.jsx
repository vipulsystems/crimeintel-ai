// src/pages/NotFound.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-950 text-white text-center px-4">
      {/* 404 TEXT */}
      <h1 className="text-8xl font-extrabold text-blue-500 mb-4 animate-pulse">
        404
      </h1>

      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-2">
        Page Not Found
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-400 mb-6 max-w-md">
        The page you’re trying to access does not exist or may have been moved.
        Please verify the URL or navigate back safely.
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
        >
          <Home size={16} />
          Dashboard
        </Link>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-xs text-gray-600 mt-8">
        Error Code: ROUTE_NOT_FOUND
      </p>
    </div>
  );
};

export default NotFound;