"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { Heart, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CanvasFooter() {
  const router = useRouter();

  const handleExport = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.fillStyle = "#121212";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `canvas-export-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={handleExport}
              variant="ghost"
              size="icon"
              className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover h-8 w-8 rounded-lg border shadow-lg">
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="px-2">
            Export as PNG
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => router.push("https://github.com/kartik-212004/collaborative-board")}
              variant="ghost"
              size="icon"
              className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover h-8 w-8 rounded-lg border shadow-lg">
              <Heart className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="px-2">
            Star the Repo
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
