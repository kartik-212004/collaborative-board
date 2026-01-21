"use client";

import { useEffect, useRef } from "react";

const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes - keeps Render free tier alive

export function useWsKeepAlive() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pingServer = async () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
        if (!wsUrl) return;

        const httpUrl = wsUrl.replace("wss://", "https://").replace("ws://", "http://");
        const healthUrl = httpUrl.endsWith("/") ? `${httpUrl}health` : `${httpUrl}/health`;

        const response = await fetch(healthUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[Keep-Alive] WS server pinged successfully - ${data.activeRooms || 0} active rooms`);
        } else {
          console.warn(`[Keep-Alive] WS server responded with status ${response.status}`);
        }
      } catch (error) {
        console.warn("[Keep-Alive] Failed to ping WS server:", error);
      }
    };

    pingServer();

    intervalRef.current = setInterval(pingServer, PING_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}
