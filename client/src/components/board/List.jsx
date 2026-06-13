import { useState } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import useBoardStore from "../../store/boardStore";
import Card from "./Card";

function List({ list, onCardClick }) {
  const { createCard, updateListTitle, deleteList } = useBoardStore();
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list.id,
    data: { type: "list" },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: list.id,
    data: { type: "list", listId: list.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function handleAddCard(e) {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    createCard(list.id, newCardTitle.trim());
    setNewCardTitle("");
    setAddingCard(false);
  }

  function handleTitleSave() {
    if (title.trim() && title !== list.title) {
      updateListTitle(list.id, title.trim());
    }
    setEditingTitle(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-paper border border-stone/20 rounded-xl p-3 w-72 flex-shrink-0 flex flex-col max-h-full"
    >
      {/* List header */}
      <div {...attributes} {...listeners} className="flex items-center justify-between mb-3 px-1 cursor-grab">
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
            className="font-body font-semibold text-sm text-graphite bg-white border border-slate/40 rounded px-2 py-1 w-full focus:outline-none"
          />
        ) : (
          <h3
            onClick={() => setEditingTitle(true)}
            className="font-body font-semibold text-sm text-graphite"
          >
            {list.title}
          </h3>
        )}
        <button
          onClick={() => {
            if (confirm(`Delete list "${list.title}" and all its cards?`)) {
              deleteList(list.id);
            }
          }}
          className="text-stone hover:text-clay transition-colors text-sm ml-2"
        >
          ✕
        </button>
      </div>

      {/* Cards */}
      <div ref={setDroppableRef} className="flex-1 overflow-y-auto space-y-2 min-h-[8px]">
        <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <Card key={card.id} card={{ ...card, listId: list.id }} onClick={() => onCardClick(card, list)} />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      {addingCard ? (
        <form onSubmit={handleAddCard} className="mt-2">
          <textarea
            autoFocus
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddCard(e);
              }
            }}
            rows={2}
            placeholder="Enter a title..."
            className="w-full px-3 py-2 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40 resize-none bg-white"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="font-body text-sm bg-clay text-white px-3 py-1.5 rounded-lg hover:bg-clay/90 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setAddingCard(false)}
              className="font-body text-sm text-stone px-3 py-1.5 hover:text-graphite transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAddingCard(true)}
          className="mt-2 font-body text-sm text-stone hover:text-slate text-left px-1 py-1.5 transition-colors"
        >
          + Add a card
        </button>
      )}
    </div>
  );
}

export default List;