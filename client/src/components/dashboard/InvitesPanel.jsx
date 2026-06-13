import { useEffect } from "react";
import useTeamStore from "../../store/teamStore";

function InvitesPanel() {
  const { myInvites, fetchMyInvites, respondToInvite } = useTeamStore();

  useEffect(() => {
    fetchMyInvites();
  }, []);

  if (myInvites.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      <h2 className="font-body font-semibold text-sm text-graphite">Pending invites</h2>
      {myInvites.map((invite) => (
        <div key={invite.id} className="bg-white border border-stone/15 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-graphite">
              <span className="font-medium">{invite.invitedBy.name}</span> invited you to{" "}
              <span className="font-medium">{invite.board.title}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => respondToInvite(invite.id, "decline")}
              className="font-body text-sm text-stone border border-stone/25 px-4 py-1.5 rounded-lg hover:bg-paper transition-colors"
            >
              Decline
            </button>
            <button
              onClick={async () => {
                const ok = await respondToInvite(invite.id, "accept");
                if (ok) window.location.reload(); // refresh boards list
              }}
              className="font-body text-sm bg-clay text-white px-4 py-1.5 rounded-lg hover:bg-clay/90 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InvitesPanel;