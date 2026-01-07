import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    backend: { status: "pending", message: "" },
    websocket: { status: "pending", message: "" },
  };

  try {
    const backendUrl = process.env.NEXT_PUBLIC_HTTP_BACKEND_URL;
    if (!backendUrl) {
      results.backend = { status: "error", message: "Backend URL not configured" };
    } else {
      const response = await fetch(`${backendUrl}/health`, {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        results.backend = { status: "ok", message: "Backend is alive" };
      } else {
        results.backend = { status: "error", message: `Backend returned ${response.status}` };
      }
    }
  } catch (error) {
    results.backend = {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to ping backend",
    };
  }

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

  const allOk = results.backend.status === "ok" && results.websocket.status === "ok";

  return NextResponse.json(
    {
      success: allOk,
      ...results,
    },
    { status: allOk ? 200 : 503 }
  );
}
