import { useState } from "react";
import useBoardStore from "../../store/boardStore";

function CreateBoardModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { createBoard } = useBoardStore();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    const board = await createBoard(title, description);
    setSubmitting(false);
    if (board) {
      onCreated(board);
    }
  }

  return (
    <div className="fixed inset-0 bg-graphite/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h2 className="font-display text-2xl font-light text-graphite mb-6">Create a new board</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-sm text-graphite mb-1.5">Board title</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div>
            <label className="block font-body text-sm text-graphite mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40 resize-none"
              placeholder="What is this board for?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-body text-sm border border-stone/25 text-graphite py-2.5 rounded-lg hover:bg-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 font-body text-sm bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBoardModal;