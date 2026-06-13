// ============================================
// AUTH STORE - Zustand
// ============================================
import { create } from "zustand";
import api from "../api/axios";
import { disconnectSocket } from "../socket";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("planit_user")) || null,
  token: localStorage.getItem("planit_token") || null,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem("planit_token", token);
      localStorage.setItem("planit_user", JSON.stringify(user));
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || "Registration failed", loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("planit_token", token);
      localStorage.setItem("planit_user", JSON.stringify(user));
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || "Login failed", loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("planit_token");
    localStorage.removeItem("planit_user");
    disconnectSocket();
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;