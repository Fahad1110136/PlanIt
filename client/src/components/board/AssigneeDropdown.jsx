import { useEffect, useState, useRef } from "react";
import useTeamStore from "../../store/teamStore";
import useBoardStore from "../../store/boardStore";

function AssigneeDropdown({ card, listId, boardId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { boardMembers, fetchBoardMembers } = useTeamStore();
  const { assignMember, unassignMember } = useBoardStore();

  useEffect(() => {
    if (open) fetchBoardMembers(boardId);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const assignedIds = new Set(card.assignees?.map((a) => a.user.id));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="font-body text-sm border border-stone/25 text-graphite px-3 py-1.5 rounded-lg hover:bg-paper transition-colors"
      >
        + Assign
      </button>

      {open && (
        <div className="absolute z-10 mt-2 bg-white border border-stone/15 rounded-lg shadow-md w-56 max-h-60 overflow-y-auto">
          {boardMembers.length === 0 && (
            <p className="font-body text-sm text-stone p-3">No members found</p>
          )}
          {boardMembers.map((member) => {
            const isAssigned = assignedIds.has(member.id);
            return (
              <button
                key={member.id}
                onClick={() => {
                  if (isAssigned) {
                    unassignMember(card.id, member.id, listId);
                  } else {
                    assignMember(card.id, member.id, listId);
                  }
                }}
                className="w-full text-left px-3 py-2 font-body text-sm hover:bg-paper transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate text-white flex items-center justify-center text-[10px] font-medium">
                    {member.name[0]?.toUpperCase()}
                  </span>
                  {member.name}
                </span>
                {isAssigned && <span className="text-clay">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssigneeDropdown;