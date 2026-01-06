"use client";

import { HelpCircle, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CanvasFooter() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover h-8 w-8 rounded-lg border shadow-lg">
              <Heart className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Support</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
