import { createContext, useState, useEffect, useMemo } from "react";
import {storage} from "../../../services/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const token = storage.getToken();
    const role = storage.getRole();

    if (token) {
      setUser({ token, role });
    }

    setLoading(false);
  }, []);

  // Persist user changes
  useEffect(() => {
    if (user?.token) {
      storage.setToken(user.token);
      if (user.role) {
        storage.setRole(user.role);
      }
    }
  }, [user]);

  // Login helper
  const login = ({ token, role }) => {
    setUser({ token, role });
  };

  // Logout
  const logout = () => {
    storage.removeToken();
    storage.removeRole();
    setUser(null);
  };

  // Memoized value
  const value = useMemo(() => {
    return {
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user?.token,
      role: user?.role || null,
    };
  }, [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};