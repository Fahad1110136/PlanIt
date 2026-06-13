// ============================================
// HOOK - subscribes to real-time board events
// ============================================
import { useEffect } from "react";
import { getSocket } from "../socket";
import useBoardStore from "../store/boardStore";
import useTeamStore from "../store/teamStore";

export function useBoardSocket(boardId) {
  const { currentBoard, setCurrentBoard } = useBoardStore();
  const { comments } = useTeamStore();

  useEffect(() => {
    if (!boardId) return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.emit("join-board", boardId);

    // ---- LIST EVENTS ----
    function onListCreated({ list }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      if (board.lists.some((l) => l.id === list.id)) return; // already added optimistically
      setCurrentBoard({ ...board, lists: [...board.lists, list] });
    }

    function onListUpdated({ list }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => (l.id === list.id ? { ...l, title: list.title } : l)),
      });
    }

    function onListDeleted({ listId }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({ ...board, lists: board.lists.filter((l) => l.id !== listId) });
    }

    // ---- CARD EVENTS ----
    function onCardCreated({ listId, card }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      if (board.lists.some((l) => l.cards.some((c) => c.id === card.id))) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => (l.id === listId ? { ...l, cards: [...l.cards, card] } : l)),
      });
    }

    function onCardUpdated({ card }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => ({
          ...l,
          cards: l.cards.map((c) => (c.id === card.id ? { ...c, ...card } : c)),
        })),
      });
    }

    function onCardDeleted({ cardId }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => ({
          ...l,
          cards: l.cards.filter((c) => c.id !== cardId),
        })),
      });
    }

    function onCardsReordered({ cards }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      // cards: [{ id, listId, position }]
      const cardMap = {};
      cards.forEach((c) => (cardMap[c.id] = c));

      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => {
          const updatedCards = l.cards
            .filter((c) => !cardMap[c.id] || cardMap[c.id].listId === l.id)
            .map((c) => (cardMap[c.id] ? { ...c, position: cardMap[c.id].position } : c))
            .sort((a, b) => a.position - b.position);

          // Add cards that moved INTO this list from elsewhere
          const incoming = cards
            .filter((c) => c.listId === l.id && !l.cards.some((existing) => existing.id === c.id))
            .map((c) => {
              // find the full card object from any list
              for (const list of board.lists) {
                const found = list.cards.find((card) => card.id === c.id);
                if (found) return { ...found, position: c.position, listId: l.id };
              }
              return null;
            })
            .filter(Boolean);

          return { ...l, cards: [...updatedCards, ...incoming].sort((a, b) => a.position - b.position) };
        }),
      });
    }

    function onCardAssigned({ cardId, assignee }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.id === cardId && !c.assignees.some((a) => a.user.id === assignee.user.id)
              ? { ...c, assignees: [...c.assignees, assignee] }
              : c
          ),
        })),
      });
    }

    function onCardUnassigned({ cardId, userId }) {
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.id === cardId
              ? { ...c, assignees: c.assignees.filter((a) => a.user.id !== userId) }
              : c
          ),
        })),
      });
    }

    // ---- COMMENT EVENTS ----
    function onCommentCreated({ cardId, comment }) {
      const state = useTeamStore.getState();
      if (state.comments.some((c) => c.id === comment.id)) return;
      useTeamStore.setState({ comments: [...state.comments, comment] });

      // Update comment count on the card
      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.id === cardId ? { ...c, _count: { comments: (c._count?.comments || 0) + 1 } } : c
          ),
        })),
      });
    }

    function onCommentDeleted({ commentId, cardId }) {
      const state = useTeamStore.getState();
      useTeamStore.setState({ comments: state.comments.filter((c) => c.id !== commentId) });

      const board = useBoardStore.getState().currentBoard;
      if (!board) return;
      setCurrentBoard({
        ...board,
        lists: board.lists.map((l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.id === cardId
              ? { ...c, _count: { comments: Math.max((c._count?.comments || 1) - 1, 0) } }
              : c
          ),
        })),
      });
    }

    socket.on("list:created", onListCreated);
    socket.on("list:updated", onListUpdated);
    socket.on("list:deleted", onListDeleted);
    socket.on("card:created", onCardCreated);
    socket.on("card:updated", onCardUpdated);
    socket.on("card:deleted", onCardDeleted);
    socket.on("cards:reordered", onCardsReordered);
    socket.on("card:assigned", onCardAssigned);
    socket.on("card:unassigned", onCardUnassigned);
    socket.on("comment:created", onCommentCreated);
    socket.on("comment:deleted", onCommentDeleted);

    return () => {
      socket.emit("leave-board", boardId);
      socket.off("list:created", onListCreated);
      socket.off("list:updated", onListUpdated);
      socket.off("list:deleted", onListDeleted);
      socket.off("card:created", onCardCreated);
      socket.off("card:updated", onCardUpdated);
      socket.off("card:deleted", onCardDeleted);
      socket.off("cards:reordered", onCardsReordered);
      socket.off("card:assigned", onCardAssigned);
      socket.off("card:unassigned", onCardUnassigned);
      socket.off("comment:created", onCommentCreated);
      socket.off("comment:deleted", onCommentDeleted);
    };
  }, [boardId]);
}