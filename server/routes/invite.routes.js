// ============================================
// INVITE ROUTES
// ============================================
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const inviteController = require("../controllers/invite.controller");

router.use(authMiddleware);

router.get("/my-invites", inviteController.getMyInvites);
router.post("/:id/respond", inviteController.respondToInvite);
router.post("/boards/:boardId", inviteController.sendInvite);
router.get("/boards/:boardId", inviteController.getBoardInvites);

module.exports = router;