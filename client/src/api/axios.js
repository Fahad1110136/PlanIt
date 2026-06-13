// ============================================
// AXIOS INSTANCE - configured for PlanIT backend
// ============================================
import axios from "axios";

// Local dev points to local server. When deployed, this will be
// replaced with the production backend URL via environment variable.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("planit_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;