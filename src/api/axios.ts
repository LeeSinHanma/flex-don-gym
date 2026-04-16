import axios from "axios";

// Support both Vite (import.meta.env) and Create React App (process.env)
const baseURL = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : undefined) || process.env.REACT_APP_API_BASE_URL || "https://flexolutions-backend.onrender.com";

const api = axios.create({
  baseURL: baseURL, // FastAPI base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;