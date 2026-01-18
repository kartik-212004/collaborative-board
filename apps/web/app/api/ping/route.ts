import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// This route pings the WebSocket server to keep it alive on Render
// The HTTP backend is now integrated into Next.js API routes
export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    websocket: { status: "pending", message: "" },
  };

  try {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      results.websocket = { status: "error", message: "WebSocket URL not configured" };
    } else {
      const httpUrl = wsUrl.replace("wss://", "https://").replace("ws://", "http://");
      const healthUrl = httpUrl.endsWith("/") ? `${httpUrl}health` : `${httpUrl}/health`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(healthUrl, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          results.websocket = {
            status: "ok",
            message: `WebSocket server is alive (${data.activeRooms || 0} active rooms)`,
          };
        } else {
          results.websocket = {
            status: "ok",
            message: `WebSocket server responded with ${response.status}`,
          };
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          results.websocket = { status: "timeout", message: "WebSocket server request timed out" };
        } else {
          results.websocket = {
            status: "error",
            message: fetchError.message || "Failed to reach WebSocket server",
          };
        }
      }
    }
  } catch (error) {
    results.websocket = {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to ping WebSocket",
    };
  }

  return NextResponse.json(
    {
      success: results.websocket.status === "ok",
      ...results,
    },
    { status: results.websocket.status === "ok" ? 200 : 503 }
  );
}
