import axios from "axios";

// Support both Vite (import.meta.env) and Create React App (process.env)
export const baseURL = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : undefined) || process.env.REACT_APP_API_BASE_URL || "https://flexolutions-backend.onrender.com";

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

// Guard to prevent multiple simultaneous 401 redirects
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "unknown";

      // Don't redirect if we're already trying to login, otherwise it refreshes the page on wrong password
      const isLoginRequest = requestUrl.includes("/users/login");

      // Only treat as a session expiry if we actually sent a token with this request
      const hadToken = !!error.config?.headers?.Authorization;

      if (!isLoginRequest && hadToken && !isLoggingOut) {
        console.warn(
          `[Auth] 401 Unauthorized on "${requestUrl}" — session expired. Clearing credentials and redirecting to login.`
        );

        isLoggingOut = true;

        // Token missing/invalid/expired — clear all auth state
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("access_list");
        localStorage.removeItem("user");

        // Use replace to avoid back-button loop
        window.location.replace("/login");
      } else if (!isLoginRequest && !hadToken) {
        // 401 on a request that had no token — likely a race condition after logout
        console.info(
          `[Auth] 401 on "${requestUrl}" but no token was sent — ignoring (already logged out).`
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;