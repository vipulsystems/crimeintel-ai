const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = BASE_URL.replace(/\/api$/, "");

export const getProxyImageUrl = (url) => {
  if (!url) return null;
  return `${BASE_URL}/image?url=${encodeURIComponent(url)}`;
};

export const getLocalMediaUrl = (path) => {
  if (!path) return null;
  return `${SERVER_URL}${path}`;
};