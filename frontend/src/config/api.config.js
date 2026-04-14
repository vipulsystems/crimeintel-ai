const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiConfig = {
  baseUrl: API_BASE_URL,

  getToken: () => {
    return localStorage.getItem("token");
  },
};