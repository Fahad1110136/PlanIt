// ============================================
// LIST CONTROLLER - create, update, delete, reorder lists
// ============================================
const prisma = require("../prisma/client");

async function createList(req, res) {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "List title is required" });
    }

    const listCount = await prisma.list.count({ where: { boardId } });

    const list = await prisma.list.create({
      data: { title, boardId, position: listCount },
    });

    req.io.to(`board:${boardId}`).emit("list:created", { list: { ...list, cards: [] } });

    res.status(201).json({ list });
  } catch (err) {
    console.error("Create list error:", err);
    res.status(500).json({ error: "Something went wrong while creating the list" });
  }
}

async function updateList(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const list = await prisma.list.update({
      where: { id },
      data: { title },
    });

    req.io.to(`board:${list.boardId}`).emit("list:updated", { list });

    res.json({ list });
  } catch (err) {
    console.error("Update list error:", err);
    res.status(500).json({ error: "Something went wrong while updating the list" });
  }
}

async function reorderLists(req, res) {
  try {
    const { lists } = req.body;

    if (!Array.isArray(lists)) {
      return res.status(400).json({ error: "Lists must be an array" });
    }

    await prisma.$transaction(
      lists.map((l) =>
        prisma.list.update({
          where: { id: l.id },
          data: { position: l.position },
        })
      )
    );

    if (lists.length > 0) {
      const firstList = await prisma.list.findUnique({ where: { id: lists[0].id } });
      req.io.to(`board:${firstList.boardId}`).emit("lists:reordered", { lists });
    }

    res.json({ message: "Lists reordered successfully" });
  } catch (err) {
    console.error("Reorder lists error:", err);
    res.status(500).json({ error: "Something went wrong while reordering lists" });
  }
}

async function deleteList(req, res) {
  try {
    const { id } = req.params;

    const list = await prisma.list.findUnique({ where: { id } });
    await prisma.list.delete({ where: { id } });

    req.io.to(`board:${list.boardId}`).emit("list:deleted", { listId: id });

    res.json({ message: "List deleted successfully" });
  } catch (err) {
    console.error("Delete list error:", err);
    res.status(500).json({ error: "Something went wrong while deleting the list" });
  }
}

module.exports = { createList, updateList, reorderLists, deleteList };