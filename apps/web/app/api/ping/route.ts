import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    websocket: { status: "pending", message: "", activeRooms: 0, activeConnections: 0 },
  };

  try {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      results.websocket = {
        status: "error",
        message: "WebSocket URL not configured",
        activeRooms: 0,
        activeConnections: 0,
      };
    } else {
      const httpUrl = wsUrl.replace("wss://", "https://").replace("ws://", "http://");
      const healthUrl = httpUrl.endsWith("/") ? `${httpUrl}health` : `${httpUrl}/health`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
            message: "WebSocket server is alive",
            activeRooms: data.activeRooms || 0,
            activeConnections: data.activeConnections || 0,
          };
        } else {
          results.websocket = {
            status: "warning",
            message: `WebSocket server responded with ${response.status}`,
            activeRooms: 0,
            activeConnections: 0,
          };
        }
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        const error = fetchError as Error & { name?: string };
        if (error.name === "AbortError") {
          results.websocket = {
            status: "timeout",
            message: "WebSocket server request timed out (may be waking up)",
            activeRooms: 0,
            activeConnections: 0,
          };
        } else {
          results.websocket = {
            status: "error",
            message: error.message || "Failed to reach WebSocket server",
            activeRooms: 0,
            activeConnections: 0,
          };
        }
      }
    }
  } catch (error) {
    results.websocket = {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to ping WebSocket",
      activeRooms: 0,
      activeConnections: 0,
    };
  }

  const isOk = results.websocket.status === "ok";

  return NextResponse.json(
    {
      success: isOk,
      ...results,
    },
    { status: isOk ? 200 : 503 }
  );
}
