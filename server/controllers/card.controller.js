// ============================================
// CARD CONTROLLER - create, update, delete, move cards
// ============================================
const prisma = require("../prisma/client");

// Helper to get boardId from a listId
async function getBoardIdFromList(listId) {
  const list = await prisma.list.findUnique({ where: { id: listId }, select: { boardId: true } });
  return list?.boardId;
}

// Helper to get boardId from a cardId
async function getBoardIdFromCard(cardId) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { list: { select: { boardId: true } } },
  });
  return card?.list?.boardId;
}

async function createCard(req, res) {
  try {
    const { listId } = req.params;
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Card title is required" });
    }

    const cardCount = await prisma.card.count({ where: { listId } });

    const card = await prisma.card.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        listId,
        position: cardCount,
      },
    });

    const boardId = await getBoardIdFromList(listId);
    req.io.to(`board:${boardId}`).emit("card:created", {
      listId,
      card: { ...card, assignees: [], _count: { comments: 0 } },
    });

    res.status(201).json({ card });
  } catch (err) {
    console.error("Create card error:", err);
    res.status(500).json({ error: "Something went wrong while creating the card" });
  }
}

async function updateCard(req, res) {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    const card = await prisma.card.update({
      where: { id },
      data,
    });

    const boardId = await getBoardIdFromCard(id);
    req.io.to(`board:${boardId}`).emit("card:updated", { card });

    res.json({ card });
  } catch (err) {
    console.error("Update card error:", err);
    res.status(500).json({ error: "Something went wrong while updating the card" });
  }
}

async function moveCard(req, res) {
  try {
    const { id } = req.params;
    const { listId, position } = req.body;

    const card = await prisma.card.update({
      where: { id },
      data: { listId, position },
    });

    const boardId = await getBoardIdFromList(listId);
    req.io.to(`board:${boardId}`).emit("card:moved", { card });

    res.json({ card });
  } catch (err) {
    console.error("Move card error:", err);
    res.status(500).json({ error: "Something went wrong while moving the card" });
  }
}

async function reorderCards(req, res) {
  try {
    const { cards } = req.body;

    if (!Array.isArray(cards)) {
      return res.status(400).json({ error: "Cards must be an array" });
    }

    await prisma.$transaction(
      cards.map((c) =>
        prisma.card.update({
          where: { id: c.id },
          data: { listId: c.listId, position: c.position },
        })
      )
    );

    if (cards.length > 0) {
      const boardId = await getBoardIdFromList(cards[0].listId);
      req.io.to(`board:${boardId}`).emit("cards:reordered", { cards });
    }

    res.json({ message: "Cards reordered successfully" });
  } catch (err) {
    console.error("Reorder cards error:", err);
    res.status(500).json({ error: "Something went wrong while reordering cards" });
  }
}

async function deleteCard(req, res) {
  try {
    const { id } = req.params;

    const boardId = await getBoardIdFromCard(id);
    const card = await prisma.card.findUnique({ where: { id } });

    await prisma.card.delete({ where: { id } });

    req.io.to(`board:${boardId}`).emit("card:deleted", { cardId: id, listId: card.listId });

    res.json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error("Delete card error:", err);
    res.status(500).json({ error: "Something went wrong while deleting the card" });
  }
}

async function assignMember(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const assignee = await prisma.cardAssignee.create({
      data: { cardId: id, userId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    const boardId = await getBoardIdFromCard(id);
    req.io.to(`board:${boardId}`).emit("card:assigned", { cardId: id, assignee });

    res.status(201).json({ assignee });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "This member is already assigned to the card" });
    }
    console.error("Assign member error:", err);
    res.status(500).json({ error: "Something went wrong while assigning the member" });
  }
}

async function unassignMember(req, res) {
  try {
    const { id, userId } = req.params;

    const boardId = await getBoardIdFromCard(id);

    await prisma.cardAssignee.delete({
      where: { userId_cardId: { userId, cardId: id } },
    });

    req.io.to(`board:${boardId}`).emit("card:unassigned", { cardId: id, userId });

    res.json({ message: "Member unassigned successfully" });
  } catch (err) {
    console.error("Unassign member error:", err);
    res.status(500).json({ error: "Something went wrong while unassigning the member" });
  }
}

module.exports = {
  createCard,
  updateCard,
  moveCard,
  reorderCards,
  deleteCard,
  assignMember,
  unassignMember,
};