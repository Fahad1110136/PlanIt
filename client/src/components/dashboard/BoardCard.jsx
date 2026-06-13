import { Link } from "react-router-dom";

function BoardCard({ board, onDelete }) {
  return (
    <div className="bg-white border border-stone/15 rounded-xl p-5 hover:shadow-md transition-shadow group relative">
      <Link to={`/board/${board.id}`}>
        <h3 className="font-body font-semibold text-graphite mb-1 pr-6">{board.title}</h3>
        {board.description && (
          <p className="font-body text-sm text-stone line-clamp-2 mb-4">{board.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-stone font-mono">
          <span>{board._count?.lists ?? 0} lists</span>
          <span>{board._count?.members ?? 0} members</span>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          if (confirm(`Delete "${board.title}"? This cannot be undone.`)) {
            onDelete(board.id);
          }
        }}
        className="absolute top-4 right-4 text-stone/0 group-hover:text-stone hover:text-clay transition-colors text-sm"
        title="Delete board"
      >
        ✕
      </button>
    </div>
  );
}

export default BoardCard;