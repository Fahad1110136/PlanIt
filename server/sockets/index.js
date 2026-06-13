// ============================================
// SOCKET.IO SETUP - real-time board updates
// ============================================
const jwt = require("jsonwebtoken");

function initSockets(io) {
  // Authenticate socket connections using JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user ${socket.userId})`);

    // Join a board "room" - all events for this board broadcast to this room
    socket.on("join-board", (boardId) => {
      socket.join(`board:${boardId}`);
    });

    socket.on("leave-board", (boardId) => {
      socket.leave(`board:${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSockets;