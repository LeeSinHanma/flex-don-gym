import axios from "axios";

const api = axios.create({
  baseURL: "https://flexolutions-backend.onrender.com", // FastAPI base URL
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;