# CollabDraw

A real-time collaborative whiteboard application built with Next.js, WebSockets,
PostgreSQL, and HTML5 Canvas. Create rooms, invite collaborators, and draw
together in real-time — like Excalidraw, but self-hostable.

## ✨ Features

- **Real-time Collaboration** — Draw together on an infinite canvas with live
  shape synchronization
- **Room System** — Create or join rooms via a 5-character invite code
- **Rich Drawing Tools** — Rectangle, Diamond, Ellipse, Arrow, Line, Pencil
  (freehand), and Text
- **Shape Editing** — Select, move, resize, duplicate (Alt+drag), and delete
  shapes
- **Styling** — Stroke color (14 colors), stroke width, fill color, and opacity
  controls
- **In-room Chat** — Real-time chat sidebar with unread message badges
- **Presence Awareness** — See who's online and whether they're actively drawing
- **Undo / Redo** — Full history stack (up to 50 states) with Ctrl+Z /
  Ctrl+Shift+Z
- **Zoom & Pan** — Scroll to zoom (0.1x–5x), right-click drag to pan
- **Export to PNG** — Download the canvas as an image
- **Keyboard Shortcuts** — Full set of shortcuts for tools, actions, and
  navigation
- **Authentication** — JWT-based signup/signin flow

## 🏗️ Architecture

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│              │  HTTP  │                  │       │              │
│   Browser    │◄──────►│   Next.js App    │◄─────►│  PostgreSQL  │
│              │        │  (API + Frontend)│       │              │
│              │   WS   │                  │       └──────────────┘
│              │◄──────►│                  │              ▲
└──────────────┘        └──────────────────┘              │
                               │                         │
                               │ WS                      │
                               ▼                         │
                        ┌──────────────────┐             │
                        │   WS Backend     │─────────────┘
                        │  (WebSocket      │   Prisma ORM
                        │   Server)        │
                        └──────────────────┘
```

## 📁 Monorepo Structure

This project uses **Turborepo** + **pnpm workspaces** for monorepo management.

### Apps

| App               | Description                                             | Port |
| ----------------- | ------------------------------------------------------- | ---- |
| `apps/web`        | Next.js 15 frontend + API routes (Auth, Rooms)          | 3000 |
| `apps/ws-backend` | Standalone WebSocket server for real-time collaboration | 8080 |

### Shared Packages

| Package                   | Description                               |
| ------------------------- | ----------------------------------------- |
| `@repo/prisma`            | Prisma client, schema, and migrations     |
| `@repo/zod`               | Shared Zod validation schemas             |
| `@repo/env`               | Environment variable loading & validation |
| `@repo/typescript-config` | Shared TypeScript configurations          |
| `@repo/eslint-config`     | Shared ESLint configurations              |
| `@repo/ui`                | Shared UI components                      |

## 🗄️ Database Schema

The system uses **PostgreSQL** with **Prisma ORM**.

| Model     | Key Fields                                                   | Description                  |
| --------- | ------------------------------------------------------------ | ---------------------------- |
| **User**  | `id` (UUID), `email` (unique), `password`, `name`, `photo`   | User accounts                |
| **Room**  | `id` (UUID), `slug` (unique 5-char code), `adminId` → User   | Drawing rooms                |
| **Chat**  | `id` (auto-int), `message`, `roomId` → Room, `userId` → User | Chat messages                |
| **Shape** | `id` (string), `roomId` → Room, `shapeData` (JSON)           | Canvas shapes stored as JSON |

## 🔌 API Endpoints

| Method | Route                   | Auth | Description                    |
| ------ | ----------------------- | ---- | ------------------------------ |
| POST   | `/api/signup`           | No   | Create a new user              |
| POST   | `/api/signin`           | No   | Authenticate and get JWT token |
| POST   | `/api/room`             | Yes  | Create or join a room by slug  |
| GET    | `/api/room?slug=<code>` | Yes  | Get room details               |
| GET    | `/api/health`           | No   | Health check                   |
| GET    | `/api/ping`             | No   | Ping WebSocket server status   |

## 🔄 WebSocket Protocol

The WebSocket server handles real-time collaboration with the following message
types:

| Message Type                    | Direction       | Description                          |
| ------------------------------- | --------------- | ------------------------------------ |
| `join`                          | Client → Server | Join a room (loads existing shapes)  |
| `init`                          | Server → Client | Send all existing shapes + user list |
| `draw`                          | Bidirectional   | New shape drawn (persisted to DB)    |
| `update`                        | Bidirectional   | Shape modified (persisted to DB)     |
| `delete`                        | Bidirectional   | Shape removed (deleted from DB)      |
| `clear`                         | Bidirectional   | Clear all shapes in room             |
| `drawing_start` / `drawing_end` | Client → Server | Presence: user is drawing / idle     |
| `user_joined` / `user_left`     | Server → Client | Room presence updates                |
| `chat`                          | Bidirectional   | Real-time chat message               |

## 🎨 Drawing Tools & Shortcuts

| Key       | Tool              |
| --------- | ----------------- |
| `V` / `1` | Select            |
| `H` / `2` | Hand (pan)        |
| `R` / `3` | Rectangle         |
| `D` / `4` | Diamond           |
| `O` / `5` | Ellipse           |
| `A` / `6` | Arrow             |
| `L` / `7` | Line              |
| `P` / `8` | Pencil (freehand) |
| `T` / `9` | Text              |
| `E` / `0` | Eraser            |

**Actions:** `Ctrl+Z` Undo · `Ctrl+Shift+Z` Redo · `Ctrl+A` Select All ·
`Delete` Remove · `Ctrl+/−` Zoom · `Ctrl+0` Reset Zoom · `Alt+Drag` Duplicate

## 🛠️ Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Monorepo         | Turborepo + pnpm workspaces                     |
| Frontend         | Next.js 15 (App Router), React 19, Tailwind CSS |
| UI Components    | Radix UI, Lucide icons, shadcn/ui               |
| Canvas           | Raw HTML5 Canvas 2D API                         |
| WebSocket Server | Node.js `ws` library                            |
| Database         | PostgreSQL 16                                   |
| ORM              | Prisma 7                                        |
| Auth             | JWT (`jsonwebtoken`)                            |
| Validation       | Zod                                             |
| Containerization | Docker + Docker Compose                         |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) package manager
- [Docker](https://www.docker.com/) & Docker Compose

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/collaborative-board.git
   cd collaborative-board
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   SECRET_KEY="your-secret-key"
   NODE_ENV=development
   WEBSOCKET_PORT=8080
   NEXT_PUBLIC_HTTP_BACKEND_URL=http://localhost:3001
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   ```

4. **Start the database:**

   ```bash
   docker compose up -d
   ```

5. **Run database migrations:**

   ```bash
   pnpm --filter @repo/prisma db:push
   ```

6. **Generate Prisma client:**

   ```bash
   pnpm --filter @repo/prisma build
   ```

7. **Start development servers:**

   ```bash
   pnpm dev
   ```

   This starts both the Next.js app (port 3000) and the WebSocket server (port
   8080).

### Docker Deployment

Use the provided `Makefile` for containerized deployment:

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `make start`         | Build images and start all services               |
| `make build`         | Build both frontend and backend Docker images     |
| `make build-web`     | Build frontend image only                         |
| `make build-backend` | Build backend image only                          |
| `make run`           | Start database, run migrations, launch containers |
| `make stop`          | Stop and remove all containers                    |
| `make clean`         | Remove containers, images, and network            |
| `make help`          | Show all available commands                       |

**Services after `make start`:**

| Service    | URL                   |
| ---------- | --------------------- |
| Frontend   | http://localhost:3000 |
| WebSocket  | ws://localhost:8080   |
| PostgreSQL | localhost:5432        |

## 📜 Turbo Commands

```bash
pnpm dev            # Start all apps in development mode
pnpm build          # Build all packages and apps
pnpm lint           # Lint all packages
pnpm check-types    # Type check all packages
```
