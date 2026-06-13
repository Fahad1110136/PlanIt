// ============================================
// BOARD, LIST, CARD ROUTES
// ============================================
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const boardController = require("../controllers/board.controller");
const listController = require("../controllers/list.controller");
const cardController = require("../controllers/card.controller");

// All routes below require authentication
router.use(authMiddleware);

// ---- BOARD ROUTES ----
router.post("/", boardController.createBoard);
router.get("/", boardController.getBoards);
router.get("/:id", boardController.getBoardById);
router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);
router.get("/:id/members", boardController.getBoardMembers);

// ---- LIST ROUTES (nested under board) ----
// router.post("/:boardId/lists", listController.createList);
// router.put("/lists/:id", listController.updateList);
// router.put("/lists/reorder", listController.reorderLists);
// router.delete("/lists/:id", listController.deleteList);
// ---- LIST ROUTES (nested under board) ----
router.post("/:boardId/lists", listController.createList);
router.put("/lists/reorder", listController.reorderLists);
router.put("/lists/:id", listController.updateList);
router.delete("/lists/:id", listController.deleteList);

// ---- CARD ROUTES (nested under list) ----
// router.post("/lists/:listId/cards", cardController.createCard);
// router.put("/cards/:id", cardController.updateCard);
// router.put("/cards/:id/move", cardController.moveCard);
// router.put("/cards/reorder", cardController.reorderCards);
// router.delete("/cards/:id", cardController.deleteCard);

// ---- CARD ROUTES (nested under list) ----
router.post("/lists/:listId/cards", cardController.createCard);
router.put("/cards/reorder", cardController.reorderCards);
router.put("/cards/:id/move", cardController.moveCard);
router.put("/cards/:id", cardController.updateCard);
router.delete("/cards/:id", cardController.deleteCard);

// ---- CARD ASSIGNEE ROUTES ----
router.post("/cards/:id/assign", cardController.assignMember);
router.delete("/cards/:id/assign/:userId", cardController.unassignMember);

module.exports = router;