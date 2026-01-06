"use client";

import { Minus, Plus, Redo2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ZoomControlsProps) {
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="border-canvas-border bg-canvas-toolbar flex items-center gap-0.5 rounded-lg border p-1 shadow-lg backdrop-blur-sm">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                className="text-canvas-foreground hover:bg-canvas-hover h-7 w-7">
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Zoom out</span>
              <kbd className="border-canvas-border bg-canvas-muted text-canvas-muted-foreground pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
                Ctrl+-
              </kbd>
            </TooltipContent>
          </Tooltip>

          <button
            onClick={onResetZoom}
            className="text-canvas-foreground hover:bg-canvas-hover min-w-[48px] rounded px-2 py-1 text-xs font-medium transition-colors">
            {zoomPercentage}%
          </button>

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                className="text-canvas-foreground hover:bg-canvas-hover h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Zoom in</span>
              <kbd className="border-canvas-border bg-canvas-muted text-canvas-muted-foreground pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
                Ctrl++
              </kbd>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Undo/Redo Controls */}
        <div className="border-canvas-border bg-canvas-toolbar flex items-center gap-0.5 rounded-lg border p-1 shadow-lg backdrop-blur-sm">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
                className="text-canvas-foreground hover:bg-canvas-hover h-7 w-7 disabled:opacity-40">
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Undo</span>
              <kbd className="border-canvas-border bg-canvas-muted text-canvas-muted-foreground pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
                Ctrl+Z
              </kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
                className="text-canvas-foreground hover:bg-canvas-hover h-7 w-7 disabled:opacity-40">
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Redo</span>
              <kbd className="border-canvas-border bg-canvas-muted text-canvas-muted-foreground pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
                Ctrl+Y
              </kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
