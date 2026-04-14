export const storage = {
  getToken: () => localStorage.getItem("token"),   // ✅ MUST match login
  setToken: (token) => localStorage.setItem("token", token),

  getRole: () => localStorage.getItem("role"),
  setRole: (role) => localStorage.setItem("role", role),

  removeToken: () => localStorage.removeItem("token"),
  removeRole: () => localStorage.removeItem("role"),
};