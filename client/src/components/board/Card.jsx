import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Card({ card, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", listId: card.listId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg p-3 shadow-sm border border-stone/10 cursor-pointer hover:shadow-md transition-shadow"
    >
      <p className="font-body text-sm text-graphite mb-2">{card.title}</p>

      <div className="flex items-center justify-between flex-wrap gap-2">
        {card.dueDate && (
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded-full ${
              isOverdue ? "bg-clay/10 text-clay" : "bg-slate/10 text-slate"
            }`}
          >
            {new Date(card.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}

        {card.assignees?.length > 0 && (
          <div className="flex -space-x-2">
            {card.assignees.slice(0, 3).map((a) => (
              <div
                key={a.id}
                title={a.user.name}
                className="w-6 h-6 rounded-full bg-slate text-white flex items-center justify-center text-[10px] font-body font-medium border-2 border-white"
              >
                {a.user.name[0]?.toUpperCase()}
              </div>
            ))}
          </div>
        )}

        {card._count?.comments > 0 && (
          <span className="font-mono text-xs text-stone">💬 {card._count.comments}</span>
        )}
      </div>
    </div>
  );
}

export default Card;