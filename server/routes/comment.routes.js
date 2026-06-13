// ============================================
// COMMENT ROUTES
// ============================================
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const commentController = require("../controllers/comment.controller");

router.use(authMiddleware);

router.get("/cards/:cardId", commentController.getComments);
router.post("/cards/:cardId", commentController.createComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;