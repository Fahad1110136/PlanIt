import { useState } from "react";
import useTeamStore from "../../store/teamStore";

function InviteModal({ boardId, onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const { sendInvite } = useTeamStore();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const result = await sendInvite(boardId, email);
    if (result.success) {
      setStatus({ type: "success", message: `Invite sent to ${email}` });
      setEmail("");
    } else {
      setStatus({ type: "error", message: result.error });
    }
  }

  return (
    <div className="fixed inset-0 bg-graphite/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h2 className="font-display text-2xl font-light text-graphite mb-6">Invite a teammate</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {status && (
            <div className={`text-sm font-body px-4 py-3 rounded-lg ${
              status.type === "success" ? "bg-sage/20 text-graphite" : "bg-clay/10 text-clay"
            }`}>
              {status.message}
            </div>
          )}

          <div>
            <label className="block font-body text-sm text-graphite mb-1.5">Email address</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
              placeholder="teammate@example.com"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-body text-sm border border-stone/25 text-graphite py-2.5 rounded-lg hover:bg-paper transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 font-body text-sm bg-clay text-white py-2.5 rounded-lg hover:bg-clay/90 transition-colors"
            >
              Send invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteModal;