import { useState } from "react";
import useBoardStore from "../../store/boardStore";
import AssigneeDropdown from "./AssigneeDropdown";
import CommentSection from "./CommentSection";

function CardModal({ card, listTitle, boardId, onClose }) {
  const { updateCard, deleteCard, unassignMember } = useBoardStore();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.slice(0, 10) : "");

  function handleSave() {
    updateCard(card.id, { title, description, dueDate: dueDate || null });
    onClose();
  }

  function handleDelete() {
    if (confirm("Delete this card?")) {
      deleteCard(card.id);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-graphite/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <p className="font-mono text-xs text-stone mb-2">in list: {listTitle}</p>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-body text-xl font-semibold text-graphite mb-4 border-b border-stone/20 pb-2 focus:outline-none focus:border-slate"
        />

        <div className="mb-4">
          <label className="block font-body text-sm text-graphite mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40 resize-none"
            placeholder="Add a more detailed description..."
          />
        </div>

        <div className="mb-4">
          <label className="block font-body text-sm text-graphite mb-1.5">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
          />
        </div>

        {/* Assignees */}
        <div className="mb-6">
          <label className="block font-body text-sm text-graphite mb-1.5">Assigned members</label>
          <div className="flex items-center gap-2 flex-wrap">
            {card.assignees?.map((a) => (
              <span
                key={a.user.id}
                className="flex items-center gap-1.5 bg-slate/10 text-slate font-body text-sm px-3 py-1.5 rounded-full"
              >
                {a.user.name}
                <button
                  onClick={() => unassignMember(card.id, a.user.id, card.listId)}
                  className="hover:text-clay transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
            <AssigneeDropdown card={card} listId={card.listId} boardId={boardId} />
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6 pt-4 border-t border-stone/15">
          <CommentSection cardId={card.id} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="font-body text-sm text-clay border border-clay/30 px-4 py-2.5 rounded-lg hover:bg-clay/10 transition-colors"
          >
            Delete card
          </button>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="font-body text-sm border border-stone/25 text-graphite px-5 py-2.5 rounded-lg hover:bg-paper transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="font-body text-sm bg-clay text-white px-5 py-2.5 rounded-lg hover:bg-clay/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardModal;