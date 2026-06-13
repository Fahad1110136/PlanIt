import { useEffect, useState } from "react";
import useTeamStore from "../../store/teamStore";
import useAuthStore from "../../store/authStore";

function CommentSection({ cardId }) {
  const { comments, fetchComments, addComment, deleteComment, clearComments } = useTeamStore();
  const { user } = useAuthStore();
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments(cardId);
    return () => clearComments();
  }, [cardId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await addComment(cardId, text.trim());
    setText("");
  }

  return (
    <div>
      <h3 className="font-body font-semibold text-sm text-graphite mb-3">Comments</h3>

      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="bg-paper rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body text-sm font-medium text-graphite">{c.author.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stone">
                  {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                {c.author.id === user?.id && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-stone hover:text-clay transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <p className="font-body text-sm text-graphite">{c.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="font-body text-sm text-stone">No comments yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border border-stone/25 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-slate/40"
        />
        <button
          type="submit"
          className="font-body text-sm bg-clay text-white px-4 py-2 rounded-lg hover:bg-clay/90 transition-colors"
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default CommentSection;