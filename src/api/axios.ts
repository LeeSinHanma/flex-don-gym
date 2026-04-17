import axios from "axios";

// Support both Vite (import.meta.env) and Create React App (process.env)
const baseURL = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : undefined) || process.env.REACT_APP_API_BASE_URL || "https://flexolutions-backend.onrender.com";

const api = axios.create({
  baseURL: baseURL, // FastAPI base URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token missing/invalid/expired
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("access_list");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;