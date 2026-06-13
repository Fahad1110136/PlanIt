// ============================================
// TEAM STORE - invites, board members, comments
// ============================================
import { create } from "zustand";
import api from "../api/axios";

const useTeamStore = create((set, get) => ({
  myInvites: [],
  boardMembers: [],
  comments: [],
  error: null,

  fetchMyInvites: async () => {
    try {
      const res = await api.get("/invites/my-invites");
      set({ myInvites: res.data.invites });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to load invites" });
    }
  },

  respondToInvite: async (inviteId, action) => {
    try {
      await api.post(`/invites/${inviteId}/respond`, { action });
      set({ myInvites: get().myInvites.filter((i) => i.id !== inviteId) });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to respond to invite" });
      return false;
    }
  },

  sendInvite: async (boardId, email) => {
    try {
      await api.post(`/invites/boards/${boardId}`, { email });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.error || "Failed to send invite";
      set({ error });
      return { success: false, error };
    }
  },

  fetchBoardMembers: async (boardId) => {
    try {
      const res = await api.get(`/boards/${boardId}/members`);
      set({ boardMembers: res.data.members });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to load board members" });
    }
  },

  fetchComments: async (cardId) => {
    try {
      const res = await api.get(`/comments/cards/${cardId}`);
      set({ comments: res.data.comments });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to load comments" });
    }
  },

  // addComment: async (cardId, text) => {
  //   try {
  //     const res = await api.post(`/comments/cards/${cardId}`, { text });
  //     set({ comments: [...get().comments, res.data.comment] });
  //     return true;
  //   } catch (err) {
  //     set({ error: err.response?.data?.error || "Failed to post comment" });
  //     return false;
  //   }
  // },
  addComment: async (cardId, text) => {
    try {
      await api.post(`/comments/cards/${cardId}`, { text });
      // Don't update state here - the socket "comment:created" event will add it
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to post comment" });
      return false;
    }
  },

  deleteComment: async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      set({ comments: get().comments.filter((c) => c.id !== commentId) });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to delete comment" });
    }
  },

  clearComments: () => set({ comments: [] }),
}));

export default useTeamStore;