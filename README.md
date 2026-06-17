# 📋 PlanIT - **Where ideas become actions**

PlanIT is a full-stack, Trello style project management application. It allows teams to organize work into boards, lists, and cards, collaborate in real time, assign members, set due dates, and discuss tasks through comments.

---

### Live Demo: https://planit-production.vercel.app/

---

## ✨ Features

- **Authentication** — register and log in with JWT-based sessions; passwords hashed with bcrypt.
- **Boards** — create, view, update, and delete boards. Each board has an owner and a list of members.
- **Lists** — add, rename, and delete lists (columns) within a board.
- **Cards** — add, edit, and delete cards (tasks) within a list, including title, description, and due date.
- **Drag and drop** — move cards between lists and reorder cards within a list using smooth drag-and-drop interactions (built with `@dnd-kit`).
- **Team collaboration**
  - Invite teammates to a board via email.
  - Real invite emails are sent using Resend.
  - Invited users see pending invites on their dashboard and can accept or decline.
  - Assign or unassign board members to specific cards.
- **Comments** — discuss tasks via per-card comment threads.
- **Real-time updates** — all board changes (lists, cards, moves, assignments, comments) sync live across all connected clients via Socket.io.
- **Landing page** — a custom-designed marketing page with a signature "sketch-to-card" animation, parallax effects, scroll reveals, and 3D tilt feature cards.

---

## 🛠️ Tech Stack

### 🎨 Frontend (`client/`)
- **React** (Vite)
- **Tailwind CSS v4** — utility-first styling with a custom design token theme
- **React Router** — client-side routing
- **Zustand** — lightweight global state management (auth, boards, team/comments)
- **@dnd-kit** — drag-and-drop for the Kanban board
- **Axios** — HTTP client for API requests
- **Socket.io Client** — real-time updates
- **Fonts**: Fraunces (display), Inter (body), IBM Plex Mono (labels/metadata)

### ⚙️ Backend (`server/`)
- **Node.js + Express** — REST API server
- **Prisma ORM (v7)** with `@prisma/adapter-pg` driver adapter — type-safe database access
- **PostgreSQL** (hosted on Neon) — relational database
- **Socket.io** — real-time WebSocket server
- **JWT (jsonwebtoken)** — authentication tokens
- **bcryptjs** — password hashing
- **Resend** — transactional email for board invites

### ☁️ Deployment
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Neon (serverless PostgreSQL)

---

## 🗂️ Project Structure

```
PlanIt/
├── server/                          # Express backend
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── sockets/
│   ├── utils/
│   ├── index.js                     # Server entry point
│   ├── prisma.config.ts             # Prisma CLI config (migrations)
│   ├── .env                         # Environment variables (not committed)
│   └── package.json
│
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── landing/             # Navbar, Hero, Problem, ProductDemo, Features, CTAFooter
│   │   │   ├── dashboard/           # DashboardNav, BoardCard, CreateBoardModal, InvitesPanel
│   │   │   └── board/               # List, Card, CardModal, InviteModal, AssigneeDropdown, CommentSection
│   │   ├── pages/
│   │   ├── store/                   # Zustand stores
│   │   ├── hooks/
│   │   ├── socket.js                # Socket.io client singleton
│   │   ├── index.css                # Tailwind + design tokens
│   │   ├── App.jsx                  # Routes
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env                         # Environment variables (not committed)
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

The database uses PostgreSQL with the following models (defined in `server/prisma/schema.prisma`):

| Model | Description |
|---|---|
| **User** | Account details: name, email, hashed password, avatar. |
| **Board** | A project board with a title, description, and owner. |
| **BoardMember** | Join table linking users to boards with a role (`owner` / `member`). |
| **Invite** | Pending/accepted/declined email invitations to a board. |
| **List** | A column on a board (e.g. "To Do"), ordered by `position`. |
| **Card** | A task within a list, with title, description, due date, ordered by `position`. |
| **CardAssignee** | Join table linking users assigned to a card. |
| **Comment** | A comment on a card, linked to its author. |

All relations use `onDelete: Cascade`, so deleting a board automatically removes its lists, cards, members, invites, assignments, and comments.

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v18 or later recommended)
- npm
- A PostgreSQL database (this project uses [Neon](https://neon.tech), free tier)
- A [Resend](https://resend.com) account for sending invite emails (free tier)

### 📥 Clone and install

```bash
git clone <your-repo-url>
cd PlanIt

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🔐 Environment Variables

### 🖥️ `server/.env`

```bash
# Pooled connection string (used at runtime by the app)
DATABASE_URL="postgresql://user:password@<pooler-host>/neondb?sslmode=require&channel_binding=require"

# Direct connection string (used by Prisma CLI for migrations)
DIRECT_URL="postgresql://user:password@<direct-host>/neondb?sslmode=require&channel_binding=require"

# Secret used to sign JWT tokens (generate with the command below)
JWT_SECRET="your-strong-random-secret"

# Port the Express server runs on
PORT=5000

# Frontend URL (used for CORS and email links)
CLIENT_URL="http://localhost:5173"

# Resend API key (for sending invite emails)
RESEND_API_KEY="your-resend-api-key"
```

### 💻 `client/.env`

```bash
VITE_API_URL=http://localhost:5000/api
```

> **Note**: Both `.env` files should be excluded from version control via `.gitignore`. When deploying, these values are set as environment variables directly in the hosting platform's dashboard (Render / Vercel), not committed to the repository.

---

## ▶️ Running the Application

### 1️⃣ Push the database schema

From `server/`:

```bash
npx prisma db push
npx prisma generate
```

This creates all tables in your Neon database based on `schema.prisma`.

### 2️⃣ Start the backend

From `server/`:

```bash
npm run dev
```

The Express + Socket.io server runs on `http://localhost:5000`. Health check: `GET /api/health`.

### 3️⃣ Start the frontend

From `client/`:

```bash
npm run dev
```

The Vite dev server runs on `http://localhost:5173`.


## 📧 Email Invites (Resend)

When a user sends a board invite via email:

1. An `Invite` record is created in the database with status `pending`.
2. The pending invite appears on their dashboard.
3. They can **Accept** (creates a `BoardMember` record and grants access to the board) or **Decline** (marks the invite as declined).

---


## 🎨 Design System

PlanIT's visual identity follows a "where ideas become actions" concept — moving from raw/sketch-like elements to structured, precise UI.

### 🎨 Color Palette
| Name | Hex | Usage |
|---|---|---|
| Paper White | `#FAF9F6` | Primary background |
| Graphite | `#1F2421` | Primary text |
| Slate Blue | `#3D5A6C` | Primary accent (links, due dates, assigned avatars) |
| Clay Orange | `#C7693D` | CTA buttons, highlights |
| Stone Gray | `#9A9590` | Secondary text, borders |
| Sage Mist | `#B8C4B8` | Subtle accents |


---

## 🔮 Future Improvements

- Direct invite acceptance via a tokenized link (no separate login step required).
- Card labels/tags and filtering.
- File attachments on cards.
- Activity log / audit trail per board.
