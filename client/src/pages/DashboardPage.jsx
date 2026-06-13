import { useEffect, useState } from "react";
import useBoardStore from "../store/boardStore";
import DashboardNav from "../components/dashboard/DashboardNav";
import BoardCard from "../components/dashboard/BoardCard";
import CreateBoardModal from "../components/dashboard/CreateBoardModal";
import InvitesPanel from "../components/dashboard/InvitesPanel";

function DashboardPage() {
  const { boards, fetchBoards, deleteBoard, loading } = useBoardStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <DashboardNav />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <InvitesPanel />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-light text-graphite">Your boards</h1>
          <button
            onClick={() => setShowModal(true)}
            className="font-body text-sm bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
          >
            + New board
          </button>
        </div>

        {loading && <p className="font-body text-stone">Loading boards...</p>}

        {!loading && boards.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-stone mb-4">You do not have any boards yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="font-body text-sm text-slate hover:underline"
            >
              Create your first board
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} onDelete={deleteBoard} />
          ))}
        </div>
      </div>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreated={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default DashboardPage;