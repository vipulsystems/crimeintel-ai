import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";

import { ProtectedRoutes, ProtectedAdmin } from "../guards/ProtectedRoutes";
import { AuthProvider } from "../features/auth/context/AuthContext";

import Skeleton from "../shared/ui/Skeleton";
import PageTransition from "../shared/components/PageTransition";

// Lazy-loaded pages
const Login = lazy(() => import("../features/auth/pages/Login"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const DashboardHome = lazy(() => import("../features/dashboard/pages/DashboardHome"));
const IntelligenceFeed = lazy(() => import("../features/intelligence/pages/IntelligenceFeed"));
const InstagramFeed = lazy(() => import("../features/intelligence/social/instagram/InstagramFeed"));
const RedditFeed = lazy(() => import("../features/intelligence/social/reddit/RedditFeed"));
const TwitterFeed = lazy(() => import("../features/intelligence/social/twitter/TwitterFeed"));
const Profile = lazy(() => import("../features/profile/pages/Profile"));
const AdminUsers = lazy(() => import("../features/admin/pages/AdminUsers"));
const AdminPosts = lazy(() => import("../features/admin/pages/AdminPosts"));
const NotFound = lazy(() => import("../app/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-darkBg p-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton type="card" count={6} />
    </div>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          {/* PUBLIC */}
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

          {/* PROTECTED */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<Dashboard />}>
              <Route path="/dashboard" element={<PageTransition><DashboardHome /></PageTransition>} />
              <Route path="/feed" element={<PageTransition><IntelligenceFeed /></PageTransition>} />
              <Route path="/intelligence" element={<Navigate to="/feed" replace />} />

              {/* SOURCE FEEDS */}
              <Route path="/sources/twitter" element={<PageTransition><TwitterFeed /></PageTransition>} />
              <Route path="/sources/instagram" element={<PageTransition><InstagramFeed /></PageTransition>} />
              <Route path="/sources/reddit" element={<PageTransition><RedditFeed /></PageTransition>} />

              {/* REDIRECTS FOR LEGACY ROUTES */}
              <Route path="/post/twitter" element={<Navigate to="/sources/twitter" replace />} />
              <Route path="/post/instagram" element={<Navigate to="/sources/instagram" replace />} />
              <Route path="/post/reddit" element={<Navigate to="/sources/reddit" replace />} />

              {/* PROFILE */}
              <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />

              {/* ADMIN */}
              <Route element={<ProtectedAdmin />}>
                <Route path="/admin/users" element={<PageTransition><AdminUsers /></PageTransition>} />
                <Route path="/admin/posts" element={<PageTransition><AdminPosts /></PageTransition>} />
              </Route>
            </Route>
          </Route>

          {/* DEFAULT & 404 */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;