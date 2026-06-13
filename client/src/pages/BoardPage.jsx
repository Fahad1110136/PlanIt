import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import useBoardStore from "../store/boardStore";
import DashboardNav from "../components/dashboard/DashboardNav";
import List from "../components/board/List";
import Card from "../components/board/Card";
import CardModal from "../components/board/CardModal";
import InviteModal from "../components/board/InviteModal";
import { useBoardSocket } from "../hooks/useBoardSocket";

function BoardPage() {
  const { id } = useParams();
  const { currentBoard, fetchBoardById, createList, moveCardLocal, persistCardOrder, setCurrentBoard } = useBoardStore();
  const [newListTitle, setNewListTitle] = useState("");
  const [addingList, setAddingList] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    fetchBoardById(id);
  }, [id]);
  useBoardSocket(id);

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-paper">
        <DashboardNav />
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="font-body text-stone">Loading board...</p>
        </div>
      </div>
    );
  }

  function handleAddList(e) {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    createList(id, newListTitle.trim());
    setNewListTitle("");
    setAddingList(false);
  }

  function findCardLocation(cardId) {
    for (const list of currentBoard.lists) {
      const card = list.cards.find((c) => c.id === cardId);
      if (card) return { list, card };
    }
    return null;
  }

  function handleDragStart(event) {
    const { active } = event;
    if (active.data.current?.type === "card") {
      const loc = findCardLocation(active.id);
      if (loc) setActiveCard(loc.card);
    }
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type !== "card") return;

    const activeLoc = findCardLocation(active.id);
    if (!activeLoc) return;

    let overListId;
    if (over.data.current?.type === "card") {
      const overLoc = findCardLocation(over.id);
      overListId = overLoc?.list.id;
    } else if (over.data.current?.type === "list") {
      overListId = over.data.current.listId;
    }
    if (!overListId) return;

    const fromListId = activeLoc.list.id;
    if (fromListId === overListId) return;

    const fromList = currentBoard.lists.find((l) => l.id === fromListId);
    const toList = currentBoard.lists.find((l) => l.id === overListId);
    const movedCard = fromList.cards.find((c) => c.id === active.id);

    let newToCards;
    if (over.data.current?.type === "card") {
      const overIndex = toList.cards.findIndex((c) => c.id === over.id);
      newToCards = [...toList.cards];
      newToCards.splice(overIndex, 0, movedCard);
    } else {
      newToCards = [...toList.cards, movedCard];
    }

    moveCardLocal(active.id, fromListId, overListId, newToCards);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;
    if (active.data.current?.type !== "card") return;

    const activeLoc = findCardLocation(active.id);
    if (!activeLoc) return;

    let overListId;
    if (over.data.current?.type === "card") {
      const overLoc = findCardLocation(over.id);
      overListId = overLoc?.list.id;
    } else if (over.data.current?.type === "list") {
      overListId = over.data.current.listId;
    }
    if (!overListId) return;

    const list = currentBoard.lists.find((l) => l.id === overListId);
    let newCards = list.cards;

    if (active.id !== over.id && over.data.current?.type === "card") {
      const oldIndex = list.cards.findIndex((c) => c.id === active.id);
      const newIndex = list.cards.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        newCards = arrayMove(list.cards, oldIndex, newIndex);
        moveCardLocal(active.id, overListId, overListId, newCards);
      }
    }

    const payload = newCards.map((c, idx) => ({ id: c.id, listId: overListId, position: idx }));
    persistCardOrder(payload);
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <DashboardNav />

      <div className="px-6 py-5 border-b border-stone/15 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-light text-graphite">{currentBoard.title}</h1>
          {currentBoard.description && (
            <p className="font-body text-sm text-stone mt-1">{currentBoard.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="font-body text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Invite
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full items-start">
            {currentBoard.lists.map((list) => (
              <List key={list.id} list={list} onCardClick={(card, list) => { setSelectedCard(card); setSelectedList(list); }} />
            ))}

            <div className="w-72 flex-shrink-0">
              {addingList ? (
                <form onSubmit={handleAddList} className="bg-paper border border-stone/20 rounded-xl p-3">
                  <input
                    autoFocus
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="List title..."
                    className="w-full px-3 py-2 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40 bg-white"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="font-body text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Add list
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingList(false)}
                      className="font-body text-sm text-stone px-3 py-1.5 hover:text-graphite transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setAddingList(true)}
                  className="w-full font-body text-sm bg-orange-500 text-white text-left px-4 py-3 rounded-xl transition-colors hover:bg-orange-600"
                >
                  + Add a list
                </button>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeCard && <Card card={activeCard} onClick={() => {}} />}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          listTitle={selectedList?.title}
          boardId={id}
          onClose={() => { setSelectedCard(null); setSelectedList(null); }}
        />
      )}

      {showInviteModal && (
        <InviteModal boardId={id} onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}

export default BoardPage;