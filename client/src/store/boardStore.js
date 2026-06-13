// ============================================
// BOARD STORE - Zustand
// ============================================
import { create } from "zustand";
import api from "../api/axios";

const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,

  assignMember: async (cardId, userId, listId) => {
    try {
      const res = await api.post(`/boards/cards/${cardId}/assign`, { userId });
      const board = get().currentBoard;
      set({
        currentBoard: {
          ...board,
          lists: board.lists.map((l) =>
            l.id === listId
              ? {
                  ...l,
                  cards: l.cards.map((c) =>
                    c.id === cardId ? { ...c, assignees: [...c.assignees, res.data.assignee] } : c
                  ),
                }
              : l
          ),
        },
      });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to assign member" });
    }
  },

  unassignMember: async (cardId, userId, listId) => {
    try {
      await api.delete(`/boards/cards/${cardId}/assign/${userId}`);
      const board = get().currentBoard;
      set({
        currentBoard: {
          ...board,
          lists: board.lists.map((l) =>
            l.id === listId
              ? {
                  ...l,
                  cards: l.cards.map((c) =>
                    c.id === cardId
                      ? { ...c, assignees: c.assignees.filter((a) => a.user.id !== userId) }
                      : c
                  ),
                }
              : l
          ),
        },
      });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to unassign member" });
    }
  },

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/boards");
      set({ boards: res.data.boards, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to load boards", loading: false });
    }
  },

  createBoard: async (title, description) => {
    set({ error: null });
    try {
      const res = await api.post("/boards", { title, description });
      set({ boards: [res.data.board, ...get().boards] });
      return res.data.board;
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to create board" });
      return null;
    }
  },

  deleteBoard: async (id) => {
    try {
      await api.delete(`/boards/${id}`);
      set({ boards: get().boards.filter((b) => b.id !== id) });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to delete board" });
    }
  },

  fetchBoardById: async (id) => {
    set({ loading: true, error: null, currentBoard: null });
    try {
      const res = await api.get(`/boards/${id}`);
      set({ currentBoard: res.data.board, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to load board", loading: false });
    }
  },

  setCurrentBoard: (board) => set({ currentBoard: board }),

  // ----------------------------
  // LIST ACTIONS
  // ----------------------------
  // createList: async (boardId, title) => {
  //   try {
  //     const res = await api.post(`/boards/${boardId}/lists`, { title });
  //     const board = get().currentBoard;
  //     set({
  //       currentBoard: {
  //         ...board,
  //         lists: [...board.lists, { ...res.data.list, cards: [] }],
  //       },
  //     });
  //   } catch (err) {
  //     set({ error: err.response?.data?.error || "Failed to create list" });
  //   }
  // },
  createList: async (boardId, title) => {
    try {
      await api.post(`/boards/${boardId}/lists`, { title });
      // Don't update state here - the socket "list:created" event will add it
      // This avoids duplicate lists from both the API response and the socket event
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to create list" });
    }
  },

  updateListTitle: async (listId, title) => {
    try {
      await api.put(`/boards/lists/${listId}`, { title });
      const board = get().currentBoard;
      set({
        currentBoard: {
          ...board,
          lists: board.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
        },
      });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to update list" });
    }
  },

  deleteList: async (listId) => {
    try {
      await api.delete(`/boards/lists/${listId}`);
      const board = get().currentBoard;
      set({
        currentBoard: {
          ...board,
          lists: board.lists.filter((l) => l.id !== listId),
        },
      });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to delete list" });
    }
  },

  // ----------------------------
  // CARD ACTIONS
  // ----------------------------
  // createCard: async (listId, title) => {
  //   try {
  //     const res = await api.post(`/boards/lists/${listId}/cards`, { title });
  //     const board = get().currentBoard;
  //     set({
  //       currentBoard: {
  //         ...board,
  //         lists: board.lists.map((l) =>
  //           l.id === listId
  //             ? { ...l, cards: [...l.cards, { ...res.data.card, assignees: [], _count: { comments: 0 } }] }
  //             : l
  //         ),
  //       },
  //     });
  //   } catch (err) {
  //     set({ error: err.response?.data?.error || "Failed to create card" });
  //   }
  // },
  createCard: async (listId, title) => {
    try {
      await api.post(`/boards/lists/${listId}/cards`, { title });
      // Don't update state here - the socket "card:created" event will add it
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to create card" });
    }
  },

  updateCard: async (cardId, data) => {
    try {
      const res = await api.put(`/boards/cards/${cardId}`, data);
      const board = get().currentBoard;
      set({
        currentBoard: {
          ...board,
          lists: board.lists.map((l) => ({
            ...l,
            cards: l.cards.map((c) => (c.id === cardId ? { ...c, ...res.data.card } : c)),
          })),
        },
      });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to update card" });
    }
  },

  deleteCard: async (cardId) => {
    try {
      await api.delete(`/boards/cards/${cardId}`);
      const board = get().currentBoard;
      set({
        currentBoard: {
          ...board,
          lists: board.lists.map((l) => ({
            ...l,
            cards: l.cards.filter((c) => c.id !== cardId),
          })),
        },
      });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to delete card" });
    }
  },

  // Move a card to a new list/position (drag-and-drop) - optimistic update
  moveCardLocal: (cardId, fromListId, toListId, newCards) => {
    const board = get().currentBoard;
    set({
      currentBoard: {
        ...board,
        lists: board.lists.map((l) => {
          if (l.id === toListId) return { ...l, cards: newCards };
          if (l.id === fromListId && fromListId !== toListId) {
            return { ...l, cards: l.cards.filter((c) => c.id !== cardId) };
          }
          return l;
        }),
      },
    });
  },

  persistCardOrder: async (cards) => {
    // cards: [{ id, listId, position }, ...]
    try {
      await api.put("/boards/cards/reorder", { cards });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to save card order" });
    }
  },
}));

export default useBoardStore;