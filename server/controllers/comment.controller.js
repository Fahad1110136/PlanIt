// ============================================
// COMMENT CONTROLLER - card comments
// ============================================
const prisma = require("../prisma/client");

async function getBoardIdFromCard(cardId) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { list: { select: { boardId: true } } },
  });
  return card?.list?.boardId;
}

async function getComments(req, res) {
  try {
    const { cardId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { cardId },
      include: { author: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      orderBy: { createdAt: "asc" },
    });

    res.json({ comments });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ error: "Something went wrong while fetching comments" });
  }
}

async function createComment(req, res) {
  try {
    const { cardId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const comment = await prisma.comment.create({
      data: { cardId, text: text.trim(), authorId: userId },
      include: { author: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    const boardId = await getBoardIdFromCard(cardId);
    req.io.to(`board:${boardId}`).emit("comment:created", { cardId, comment });

    res.status(201).json({ comment });
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ error: "Something went wrong while posting the comment" });
  }
}

async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: "You can only delete your own comments" });
    }

    const boardId = await getBoardIdFromCard(comment.cardId);

    await prisma.comment.delete({ where: { id } });

    req.io.to(`board:${boardId}`).emit("comment:deleted", { commentId: id, cardId: comment.cardId });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ error: "Something went wrong while deleting the comment" });
  }
}

module.exports = { getComments, createComment, deleteComment };