// ============================================
// PLANIT SERVER - Entry Point
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const initSockets = require("./sockets");

const app = express();
const server = http.createServer(app);

// ============================================
// SOCKET.IO SETUP
// ============================================
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   },
// });
///////////////////////////////////////////////////////////////////// new /////////////////
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
///////////////////////////////////////////////////////////////////////////////////////////
initSockets(io);

// Make io accessible in route handlers via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ============================================
// MIDDLEWARE
// ============================================
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:5173",
//   credentials: true,
// }));
////////////////////////////////////////////////////////// new //////////////////////////////
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://planit-production.vercel.app",
  "https://planit-frontend-client-production.vercel.app",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
/////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.json());

// ============================================
// ROUTES
// ============================================
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const boardRoutes = require("./routes/board.routes");
app.use("/api/boards", boardRoutes);

const inviteRoutes = require("./routes/invite.routes");
app.use("/api/invites", inviteRoutes);

const commentRoutes = require("./routes/comment.routes");
app.use("/api/comments", commentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PlanIT server is running" });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`PlanIT server running on port ${PORT}`);
});