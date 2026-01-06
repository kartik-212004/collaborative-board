"use client";

import { useState } from "react";

import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CanvasHeaderProps {
  roomId: string;
  isConnected: boolean;
  connectedUsers?: number;
  roomName?: string;
}

export function CanvasHeader({ roomId, isConnected, connectedUsers = 1, roomName }: CanvasHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {/* Connection Status */}
        <div className="border-canvas-border bg-canvas-toolbar hidden items-center gap-2 rounded-lg border px-3 py-1.5 shadow-lg sm:flex">
          <div
            className={`h-2 w-2 rounded-full ${isConnected ? "animate-pulse bg-emerald-500" : "bg-rose-500"}`}
          />
          <span className="text-canvas-muted-foreground text-xs">
            {isConnected ? `${connectedUsers} online` : "Offline"}
          </span>
        </div>

        {/* Room ID Copy */}
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyRoomId}
              className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover h-9 gap-2 rounded-lg border px-3 shadow-lg">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden max-w-[80px] truncate text-xs sm:inline">
                {roomName || roomId.slice(0, 8)}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{copied ? "Copied!" : "Copy room code"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
