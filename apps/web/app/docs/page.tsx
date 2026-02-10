"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  Github,
  Server,
  Package,
  Database,
  Globe,
  Pencil,
  MousePointer,
  Hand,
  Square,
  Diamond,
  Circle,
  ArrowUpRight,
  Minus,
  Type,
  Eraser,
} from "lucide-react";

import Logo from "@/modules/home/logo";

// ─── Docs Navbar ───────────────────────────────────────────────────────────────
function DocsNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100">
              • CollabDraw
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-gray-500 md:flex dark:text-gray-400">
            <Link href="/" className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
              Home
            </Link>
            <Link
              href="/docs"
              className="text-gray-900 transition-colors hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100">
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/kartik-212004/collaborative-board"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Section Card Wrapper ──────────────────────────────────────────────────────
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}

// ─── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
      {children}
    </h2>
  );
}

// ─── Table Component ───────────────────────────────────────────────────────────
function DocTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {headers.map((h, i) => (
              <th key={i} className="pb-3 pr-6 font-semibold text-gray-900">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-3 pr-6 text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Code Block ────────────────────────────────────────────────────────────────
function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {title && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto bg-gray-950 p-4 text-sm leading-relaxed text-gray-100">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ─── Inline Code ───────────────────────────────────────────────────────────────
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
      {children}
    </code>
  );
}

// ─── Subsection Title ──────────────────────────────────────────────────────────
function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 mt-6 text-lg font-bold text-gray-900 dark:text-gray-100">{children}</h3>;
}

// ─── Main Docs Page ────────────────────────────────────────────────────────────
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-500/20 dark:bg-gray-950 dark:text-gray-100">
      <DocsNavbar />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white py-16 sm:py-24 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
            CollabDraw{" "}
            <span className="font-light italic text-gray-400 dark:text-gray-500">Documentation</span>
          </h1>
          <p className="font-mono text-sm leading-relaxed text-gray-500 sm:text-base dark:text-gray-400">
            Explore the technical architecture and implementation details of a
            <br className="hidden sm:block" /> real-time collaborative whiteboard application.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
        {/* ── System Architecture ─────────────────────────────────── */}
        <SectionCard>
          <SectionTitle id="architecture">System Architecture</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <Image
              src="/collabdraw.png"
              alt="CollabDraw System Architecture"
              width={1200}
              height={600}
              className="w-full object-contain"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            The system follows a monorepo architecture with two apps — a Next.js 15 frontend handling UI,
            authentication and API routes, and a standalone WebSocket server for real-time canvas
            collaboration. Both apps share a PostgreSQL database via Prisma ORM, and communicate through
            WebSocket connections for live drawing synchronization.
          </p>
        </SectionCard>

        {/* ── Core Components ─────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle id="components">Core Components &amp; Implementation</SectionTitle>
          <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
            <SubTitle>Monorepo Structure</SubTitle>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Built with <Code>Turborepo</Code> + <Code>pnpm workspaces</Code> for efficient monorepo
              management.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Apps */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Apps</h4>
                <div className="space-y-2">
                  {[
                    {
                      name: "apps/web",
                      desc: "Next.js 15 frontend + API routes",
                      port: "3000",
                      icon: Globe,
                    },
                    {
                      name: "apps/ws-backend",
                      desc: "WebSocket server for real-time collab",
                      port: "8080",
                      icon: Server,
                    },
                  ].map((app) => (
                    <div
                      key={app.name}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                      <app.icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Code>{app.name}</Code>
                          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                            :{app.port}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{app.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packages */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Shared Packages
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      name: "@repo/prisma",
                      desc: "Prisma client, schema & migrations",
                    },
                    { name: "@repo/zod", desc: "Shared Zod validation schemas" },
                    {
                      name: "@repo/typescript-config",
                      desc: "Shared TypeScript configs",
                    },
                    {
                      name: "@repo/eslint-config",
                      desc: "Shared ESLint configs",
                    },
                    { name: "@repo/ui", desc: "Shared UI components" },
                  ].map((pkg) => (
                    <div
                      key={pkg.name}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                      <Package className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <Code>{pkg.name}</Code>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{pkg.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── API Endpoints ───────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle id="api">API Endpoints</SectionTitle>
          <div className="mt-4">
            <DocTable
              headers={["Method", "Route", "Auth", "Description"]}
              rows={[
                [
                  <span
                    key="m1"
                    className="rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    POST
                  </span>,
                  <Code key="r1">/api/signup</Code>,
                  "No",
                  "Create a new user",
                ],
                [
                  <span
                    key="m2"
                    className="rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    POST
                  </span>,
                  <Code key="r2">/api/signin</Code>,
                  "No",
                  "Authenticate and get JWT token",
                ],
                [
                  <span
                    key="m3"
                    className="rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    POST
                  </span>,
                  <Code key="r3">/api/room</Code>,
                  "Yes",
                  "Create or join a room by slug",
                ],
                [
                  <span
                    key="m4"
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    GET
                  </span>,
                  <Code key="r4">/api/room?slug=&lt;code&gt;</Code>,
                  "Yes",
                  "Get room details",
                ],
                [
                  <span
                    key="m5"
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    GET
                  </span>,
                  <Code key="r5">/api/health</Code>,
                  "No",
                  "Health check",
                ],
                [
                  <span
                    key="m6"
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    GET
                  </span>,
                  <Code key="r6">/api/ping</Code>,
                  "No",
                  "Ping WebSocket server status",
                ],
              ]}
            />
          </div>
        </SectionCard>

        {/* ── Drawing Tools ───────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle id="tools">Drawing Tools &amp; Shortcuts</SectionTitle>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { keys: "V / 1", tool: "Select", icon: MousePointer },
              { keys: "H / 2", tool: "Hand (pan)", icon: Hand },
              { keys: "R / 3", tool: "Rectangle", icon: Square },
              { keys: "D / 4", tool: "Diamond", icon: Diamond },
              { keys: "O / 5", tool: "Ellipse", icon: Circle },
              { keys: "A / 6", tool: "Arrow", icon: ArrowUpRight },
              { keys: "L / 7", tool: "Line", icon: Minus },
              { keys: "P / 8", tool: "Pencil (freehand)", icon: Pencil },
              { keys: "T / 9", tool: "Text", icon: Type },
              { keys: "E / 0", tool: "Eraser", icon: Eraser },
            ].map((item) => (
              <div
                key={item.keys}
                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/50">
                <item.icon className="h-4 w-4 shrink-0 text-gray-400" />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.tool}</span>
                  <kbd className="rounded border border-gray-200 bg-white px-2 py-0.5 font-mono text-xs text-gray-500 shadow-sm">
                    {item.keys}
                  </kbd>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Undo", shortcut: "Ctrl+Z" },
                { label: "Redo", shortcut: "Ctrl+Shift+Z" },
                { label: "Select All", shortcut: "Ctrl+A" },
                { label: "Delete", shortcut: "Delete" },
                { label: "Zoom In", shortcut: "Ctrl++" },
                { label: "Zoom Out", shortcut: "Ctrl+-" },
                { label: "Reset Zoom", shortcut: "Ctrl+0" },
                { label: "Duplicate", shortcut: "Alt+Drag" },
              ].map((action) => (
                <div
                  key={action.label}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 dark:border-gray-700 dark:bg-gray-900">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{action.label}</span>
                  <kbd className="font-mono text-[10px] text-gray-400">{action.shortcut}</kbd>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── Tech Stack ──────────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle id="stack">Tech Stack</SectionTitle>
          <div className="mt-4">
            <DocTable
              headers={["Layer", "Technology"]}
              rows={[
                [
                  <span key="l1" className="font-medium text-gray-900 dark:text-gray-100">
                    Monorepo
                  </span>,
                  "Turborepo + pnpm workspaces",
                ],
                [
                  <span key="l2" className="font-medium text-gray-900 dark:text-gray-100">
                    Frontend
                  </span>,
                  "Next.js 15 (App Router), React 19, Tailwind CSS",
                ],
                [
                  <span key="l3" className="font-medium text-gray-900 dark:text-gray-100">
                    UI Components
                  </span>,
                  "Radix UI, Lucide icons, shadcn/ui",
                ],
                [
                  <span key="l4" className="font-medium text-gray-900 dark:text-gray-100">
                    Canvas
                  </span>,
                  "Raw HTML5 Canvas 2D API",
                ],
                [
                  <span key="l5" className="font-medium text-gray-900 dark:text-gray-100">
                    WebSocket Server
                  </span>,
                  "Node.js ws library",
                ],
                [
                  <span key="l6" className="font-medium text-gray-900 dark:text-gray-100">
                    Database
                  </span>,
                  "PostgreSQL 16",
                ],
                [
                  <span key="l7" className="font-medium text-gray-900 dark:text-gray-100">
                    ORM
                  </span>,
                  "Prisma 7",
                ],
                [
                  <span key="l8" className="font-medium text-gray-900 dark:text-gray-100">
                    Auth
                  </span>,
                  "JWT (jsonwebtoken)",
                ],
                [
                  <span key="l9" className="font-medium text-gray-900 dark:text-gray-100">
                    Validation
                  </span>,
                  "Zod",
                ],
                [
                  <span key="l10" className="font-medium text-gray-900 dark:text-gray-100">
                    Containerization
                  </span>,
                  "Docker + Docker Compose",
                ],
              ]}
            />
          </div>
        </SectionCard>

        {/* ── Getting Started ─────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle id="getting-started">Getting Started</SectionTitle>
          <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-4">
              Prerequisites: <Code>Node.js v20+</Code>, <Code>pnpm</Code>, <Code>Docker</Code> &amp; Docker
              Compose
            </p>
          </div>

          <div className="mt-4 space-y-5">
            <div>
              <SubTitle>1. Clone the repository</SubTitle>
              <CodeBlock title="bash">{`git clone https://github.com/your-username/collaborative-board.git
cd collaborative-board`}</CodeBlock>
            </div>

            <div>
              <SubTitle>2. Install dependencies</SubTitle>
              <CodeBlock title="bash">{`pnpm install`}</CodeBlock>
            </div>

            <div>
              <SubTitle>3. Set up environment variables</SubTitle>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Create a <Code>.env</Code> file in the root:
              </p>
              <CodeBlock title=".env">{`DATABASE_URL="postgresql://user:password@localhost:5432/db"
SECRET_KEY="your-secret-key"
NODE_ENV=development
WEBSOCKET_PORT=8080
NEXT_PUBLIC_HTTP_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080`}</CodeBlock>
            </div>

            <div>
              <SubTitle>4. Start the database</SubTitle>
              <CodeBlock title="bash">{`docker compose up -d`}</CodeBlock>
            </div>

            <div>
              <SubTitle>5. Run database migrations</SubTitle>
              <CodeBlock title="bash">{`pnpm --filter @repo/prisma db:push`}</CodeBlock>
            </div>

            <div>
              <SubTitle>6. Generate Prisma client</SubTitle>
              <CodeBlock title="bash">{`pnpm --filter @repo/prisma build`}</CodeBlock>
            </div>

            <div>
              <SubTitle>7. Start development servers</SubTitle>
              <CodeBlock title="bash">{`pnpm dev`}</CodeBlock>
              <p className="mt-2 text-sm text-gray-500">
                This starts both the Next.js app (port 3000) and the WebSocket server (port 8080).
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Docker Deployment ────────────────────────────────────── */}
        <SectionCard>
          <SectionTitle id="docker">Docker Deployment</SectionTitle>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Use the provided <Code>Makefile</Code> for containerized deployment:
          </p>
          <div className="mt-4">
            <DocTable
              headers={["Command", "Description"]}
              rows={[
                [<Code key="c1">make start</Code>, "Build images and start all services"],
                [<Code key="c2">make build</Code>, "Build both frontend and backend Docker images"],
                [<Code key="c3">make build-web</Code>, "Build frontend image only"],
                [<Code key="c4">make build-backend</Code>, "Build backend image only"],
                [<Code key="c5">make run</Code>, "Start database, run migrations, launch containers"],
                [<Code key="c6">make stop</Code>, "Stop and remove all containers"],
                [<Code key="c7">make clean</Code>, "Remove containers, images, and network"],
                [<Code key="c8">make help</Code>, "Show all available commands"],
              ]}
            />
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Services after <Code>make start</Code>
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  name: "Frontend",
                  url: "http://localhost:3000",
                  icon: Globe,
                },
                {
                  name: "WebSocket",
                  url: "ws://localhost:8080",
                  icon: Server,
                },
                {
                  name: "PostgreSQL",
                  url: "localhost:5432",
                  icon: Database,
                },
              ].map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                  <svc.icon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{svc.name}</p>
                    <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{svc.url}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="border-t border-gray-200 py-8 text-center dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} CollabDraw. Built with Next.js, WebSockets &amp; Canvas.
          </p>
        </footer>
      </main>
    </div>
  );
}
