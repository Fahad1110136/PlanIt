const { sendInviteEmail } = require("../utils/email");
// ============================================
// INVITE CONTROLLER - email invites to boards
// ============================================
const prisma = require("../prisma/client");

// ----------------------------
// SEND INVITE
// ----------------------------
async function sendInvite(req, res) {
  try {
    const { boardId } = req.params;
    const { email } = req.body;
    const userId = req.userId;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Only board owner/members can invite
    const membership = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    if (!membership) {
      return res.status(403).json({ error: "You don't have access to this board" });
    }

    // Check if invited email is already a member
    const invitedUser = await prisma.user.findUnique({ where: { email } });
    if (invitedUser) {
      const existingMembership = await prisma.boardMember.findUnique({
        where: { userId_boardId: { userId: invitedUser.id, boardId } },
      });
      if (existingMembership) {
        return res.status(409).json({ error: "This user is already a member of the board" });
      }
    }

    // Check for existing pending invite
    const existingInvite = await prisma.invite.findFirst({
      where: { boardId, email, status: "pending" },
    });
    if (existingInvite) {
      return res.status(409).json({ error: "An invite has already been sent to this email" });
    }

    // const invite = await prisma.invite.create({
    //   data: { boardId, email, invitedById: userId },
    // });

    // res.status(201).json({ invite });
    const invite = await prisma.invite.create({
      data: { boardId, email, invitedById: userId },
      include: {
        board: { select: { title: true } },
        invitedBy: { select: { name: true } },
      },
    });

    // Send email notification (does not block invite creation if it fails)
    sendInviteEmail({
      to: email,
      boardTitle: invite.board.title,
      inviterName: invite.invitedBy.name,
    });

    res.status(201).json({ invite });

  } catch (err) {
    console.error("Send invite error:", err);
    res.status(500).json({ error: "Something went wrong while sending the invite" });
  }
}

// ----------------------------
// GET PENDING INVITES FOR CURRENT USER (by their email)
// ----------------------------
async function getMyInvites(req, res) {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const invites = await prisma.invite.findMany({
      where: { email: user.email, status: "pending" },
      include: {
        board: { select: { id: true, title: true, description: true } },
        invitedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ invites });
  } catch (err) {
    console.error("Get my invites error:", err);
    res.status(500).json({ error: "Something went wrong while fetching invites" });
  }
}

// ----------------------------
// RESPOND TO INVITE (accept/decline)
// ----------------------------
async function respondToInvite(req, res) {
  try {
    const { id } = req.params; // invite id
    const { action } = req.body; // "accept" | "decline"
    const userId = req.userId;

    const invite = await prisma.invite.findUnique({ where: { id } });
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (invite.email !== user.email) {
      return res.status(403).json({ error: "This invite is not addressed to you" });
    }

    if (action === "accept") {
      // Create board membership + mark invite accepted (transaction)
      await prisma.$transaction([
        prisma.boardMember.create({
          data: { userId, boardId: invite.boardId, role: "member" },
        }),
        prisma.invite.update({ where: { id }, data: { status: "accepted" } }),
      ]);
      return res.json({ message: "Invite accepted" });
    } else if (action === "decline") {
      await prisma.invite.update({ where: { id }, data: { status: "declined" } });
      return res.json({ message: "Invite declined" });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "You are already a member of this board" });
    }
    console.error("Respond to invite error:", err);
    res.status(500).json({ error: "Something went wrong while responding to the invite" });
  }
}

// ----------------------------
// GET PENDING INVITES FOR A BOARD (so owner can see who's invited)
// ----------------------------
async function getBoardInvites(req, res) {
  try {
    const { boardId } = req.params;

    const invites = await prisma.invite.findMany({
      where: { boardId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    res.json({ invites });
  } catch (err) {
    console.error("Get board invites error:", err);
    res.status(500).json({ error: "Something went wrong while fetching board invites" });
  }
}

module.exports = { sendInvite, getMyInvites, respondToInvite, getBoardInvites };