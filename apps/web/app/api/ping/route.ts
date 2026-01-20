import { NextResponse } from "next/server";

import { NEXT_PUBLIC_WS_URL } from "@repo/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  console.log(`[CRON] Ping started at ${new Date().toISOString()}`);

  const results = {
    timestamp: new Date().toISOString(),
    websocket: { status: "pending", message: "" },
  };

  try {
    const wsUrl = NEXT_PUBLIC_WS_URL;
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

  console.log(`[CRON] Ping completed: ${results.websocket.status} - ${results.websocket.message}`);

  return NextResponse.json(
    {
      success: results.websocket.status === "ok",
      ...results,
    },
    { status: results.websocket.status === "ok" ? 200 : 503 }
  );
}
