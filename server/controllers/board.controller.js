// ============================================
// BOARD CONTROLLER - create, get, update, delete boards
// ============================================
const prisma = require("../prisma/client");

// ----------------------------
// CREATE BOARD
// ----------------------------
async function createBoard(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ error: "Board title is required" });
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        ownerId: userId,
        members: {
          create: { userId, role: "owner" },
        },
      },
      include: { members: true },
    });

    res.status(201).json({ board });
  } catch (err) {
    console.error("Create board error:", err);
    res.status(500).json({ error: "Something went wrong while creating the board" });
  }
}

// ----------------------------
// GET ALL BOARDS (for current user - owned + member of)
// ----------------------------
async function getBoards(req, res) {
  try {
    const userId = req.userId;

    const boards = await prisma.board.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        _count: { select: { lists: true, members: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ boards });
  } catch (err) {
    console.error("Get boards error:", err);
    res.status(500).json({ error: "Something went wrong while fetching boards" });
  }
}

// ----------------------------
// GET SINGLE BOARD (with lists, cards, members)
// ----------------------------
async function getBoardById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
              include: {
                assignees: {
                  include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
                },
                _count: { select: { comments: true } },
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check user is a member of this board
    const isMember = board.members.some((m) => m.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: "You don't have access to this board" });
    }

    res.json({ board });
  } catch (err) {
    console.error("Get board error:", err);
    res.status(500).json({ error: "Something went wrong while fetching the board" });
  }
}

// ----------------------------
// UPDATE BOARD (title, description)
// ----------------------------
async function updateBoard(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.userId;

    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    if (board.ownerId !== userId) {
      return res.status(403).json({ error: "Only the board owner can update board details" });
    }

    const updatedBoard = await prisma.board.update({
      where: { id },
      data: { title, description },
    });

    res.json({ board: updatedBoard });
  } catch (err) {
    console.error("Update board error:", err);
    res.status(500).json({ error: "Something went wrong while updating the board" });
  }
}

// ----------------------------
// DELETE BOARD
// ----------------------------
async function deleteBoard(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    if (board.ownerId !== userId) {
      return res.status(403).json({ error: "Only the board owner can delete this board" });
    }

    await prisma.board.delete({ where: { id } });

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Delete board error:", err);
    res.status(500).json({ error: "Something went wrong while deleting the board" });
  }
}

// ----------------------------
// GET BOARD MEMBERS (for assigning to cards)
// ----------------------------
async function getBoardMembers(req, res) {
  try {
    const { id } = req.params;

    const members = await prisma.boardMember.findMany({
      where: { boardId: id },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    res.json({ members: members.map((m) => ({ ...m.user, role: m.role })) });
  } catch (err) {
    console.error("Get board members error:", err);
    res.status(500).json({ error: "Something went wrong while fetching members" });
  }
}

module.exports = { createBoard, getBoards, getBoardById, updateBoard, deleteBoard, getBoardMembers };