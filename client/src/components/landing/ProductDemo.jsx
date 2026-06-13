import { useState, useRef } from "react";

const INITIAL_COLUMNS = {
  todo: {
    title: "To Do",
    color: "#b0c8da",
    cards: [
      { id: "1", title: "Design landing page", due: "Mon" },
      { id: "2", title: "Set up database", due: "Tue" },
      { id: "3", title: "Write copy", due: "Wed" },
    ],
  },
  inprogress: {
    title: "In Progress",
    color: "#c1622f",
    cards: [
      { id: "4", title: "Build auth flow", due: "Wed" },
    ],
  },
  done: {
    title: "Done",
    color: "#4a6278",
    cards: [
      { id: "5", title: "Project kickoff", due: "Fri" },
      { id: "6", title: "Wireframes", due: "Fri" },
    ],
  },
};

export default function ProductDemo() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const dragNode = useRef(null);

  const handleDragStart = (e, cardId, fromCol) => {
    setDragging({ cardId, fromCol });
    dragNode.current = e.currentTarget;
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = "0.35";
    }, 0);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = "1";
    dragNode.current = null;
    setDragging(null);
    setDragOver(null);
    setDropIndex(null);
  };

  const handleDragOverCard = (e, colId, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(colId);
    setDropIndex(index);
  };

  const handleDragOverCol = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(colId);
    if (dropIndex === null) {
      setDropIndex(columns[colId].cards.length);
    }
  };

  const handleDrop = (e, toCol, toIndex) => {
    e.preventDefault();
    if (!dragging) return;
    const { cardId, fromCol } = dragging;

    setColumns(prev => {
      const fromCards = [...prev[fromCol].cards];
      const toCards = fromCol === toCol ? fromCards : [...prev[toCol].cards];

      const cardIndex = fromCards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [card] = fromCards.splice(cardIndex, 1);

      const insertAt = toIndex ?? toCards.length;

      if (fromCol === toCol) {
        fromCards.splice(insertAt, 0, card);
        return {
          ...prev,
          [fromCol]: { ...prev[fromCol], cards: fromCards },
        };
      } else {
        toCards.splice(insertAt, 0, card);
        return {
          ...prev,
          [fromCol]: { ...prev[fromCol], cards: fromCards },
          [toCol]: { ...prev[toCol], cards: toCards },
        };
      }
    });

    handleDragEnd();
  };

  return (
    <section className="py-32 px-6 bg-white/50">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl font-light text-graphite mb-4">
          One board. <span className="font-bold">Total clarity.</span>
        </h2>
        <p className="font-body text-lg text-stone max-w-xl mx-auto">
          See exactly what is happening, who is doing it, and what is next.
          Drag cards between columns — try it yourself.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([colId, col]) => (
          <div
            key={colId}
            onDragOver={(e) => handleDragOverCol(e, colId)}
            onDrop={(e) => handleDrop(e, colId, dropIndex ?? col.cards.length)}
            style={{
              background: dragOver === colId ? "rgba(193,98,47,0.04)" : undefined,
              transition: "background 0.2s ease",
            }}
            className="bg-paper border border-stone/20 rounded-xl p-4 min-h-48"
          >
            {/* Column header */}
            <div className="flex items-center gap-2 mb-4 px-1">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
              <h3 className="font-body font-semibold text-sm text-graphite">{col.title}</h3>
              <span
                className="ml-auto font-mono text-xs px-2 py-0.5 rounded-full"
                style={{ background: col.color + "22", color: col.color }}
              >
                {col.cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {col.cards.map((card, i) => (
                <div key={card.id}>
                  {/* Drop indicator line above */}
                  {dragOver === colId && dropIndex === i && dragging?.cardId !== card.id && (
                    <div
                      style={{
                        height: 3,
                        borderRadius: 2,
                        background: "#c1622f",
                        marginBottom: 6,
                        opacity: 0.7,
                      }}
                    />
                  )}

                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id, colId)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOverCard(e, colId, i)}
                    onDrop={(e) => handleDrop(e, colId, i)}
                    style={{
                      cursor: "grab",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                    className={`bg-white rounded-lg p-3 shadow-sm border border-stone/10
                      hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing
                      ${dragging?.cardId === card.id ? "opacity-40" : "opacity-100"}
                      ${colId === "inprogress" && i === 0 ? "ring-2 ring-slate/30" : ""}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-body text-sm text-graphite leading-snug">{card.title}</p>
                      <div className="flex flex-col gap-0.5 ml-2 mt-0.5 opacity-30 flex-shrink-0">
                        {[0, 1, 2].map(r => (
                          <div key={r} className="flex gap-0.5">
                            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#4a6278" }} />
                            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#4a6278" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-slate bg-slate/10 px-2 py-0.5 rounded-full">
                      Due {card.due}
                    </span>
                  </div>
                </div>
              ))}

              {/* Drop indicator at bottom */}
              {dragOver === colId && dropIndex === col.cards.length && col.cards.length > 0 && (
                <div
                  style={{
                    height: 3,
                    borderRadius: 2,
                    background: "#c1622f",
                    marginTop: 6,
                    opacity: 0.7,
                  }}
                />
              )}

              {/* Empty column placeholder */}
              {col.cards.length === 0 && (
                <div
                  style={{
                    border: "2px dashed",
                    borderColor: dragOver === colId ? "#c1622f" : "#dde8f0",
                    borderRadius: 10,
                    padding: "20px 12px",
                    textAlign: "center",
                    color: dragOver === colId ? "#c1622f" : "#b0c8da",
                    fontSize: 12,
                    fontFamily: "IBM Plex Mono, monospace",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reset button */}
      <div className="max-w-5xl mx-auto mt-8 flex justify-end">
        <button
          onClick={() => setColumns(INITIAL_COLUMNS)}
          className="font-mono text-xs text-stone hover:text-graphite transition-colors px-3 py-1.5 rounded-lg border border-stone/20 hover:border-stone/40"
        >
          ↺ Reset board
        </button>
      </div>
    </section>
  );
}