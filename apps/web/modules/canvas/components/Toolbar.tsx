"use client";

import {
  ArrowUpRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Minus,
  MousePointer2,
  Pencil,
  Square,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { type Tool } from "../types";

interface ToolbarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
}

const tools: { id: Tool; icon: React.ReactNode; label: string; shortcut: string }[] = [
  { id: "hand", icon: <Hand className="h-5 w-5" />, label: "Hand", shortcut: "H" },
  { id: "select", icon: <MousePointer2 className="h-5 w-5" />, label: "Selection", shortcut: "V" },
  { id: "rectangle", icon: <Square className="h-5 w-5" />, label: "Rectangle", shortcut: "R" },
  { id: "diamond", icon: <Diamond className="h-5 w-5" />, label: "Diamond", shortcut: "D" },
  { id: "ellipse", icon: <Circle className="h-5 w-5" />, label: "Ellipse", shortcut: "O" },
  { id: "arrow", icon: <ArrowUpRight className="h-5 w-5" />, label: "Arrow", shortcut: "A" },
  { id: "line", icon: <Minus className="h-5 w-5" />, label: "Line", shortcut: "L" },
  { id: "pencil", icon: <Pencil className="h-5 w-5" />, label: "Draw", shortcut: "P" },
  { id: "eraser", icon: <Eraser className="h-5 w-5" />, label: "Eraser", shortcut: "E" },
];

export function Toolbar({ currentTool, onToolChange }: ToolbarProps) {
  return (
    <TooltipProvider>
      <div className="border-canvas-border bg-canvas-toolbar flex items-center gap-1 rounded-xl border p-1.5 shadow-lg backdrop-blur-sm">
        {tools.map((tool, index) => {
          const isSelected = currentTool === tool.id && tool.label !== "Lock";
          return (
            <Tooltip key={`${tool.id}-${index}`}>
              <TooltipTrigger>
                <Toggle
                  pressed={isSelected}
                  onPressedChange={() => onToolChange(tool.id)}
                  className={`relative h-10 w-10 rounded-lg border-0 text-white hover:text-white ${
                    isSelected ? "bg-white text-black ring-2 ring-white/50" : "hover:bg-white/10"
                  }`}
                  aria-label={tool.label}>
                  {tool.icon}
                  <span className={`absolute bottom-0.5 right-0.5 text-[9px] font-medium leading-none`}>
                    {tool.shortcut}
                  </span>
                </Toggle>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex items-center gap-2 px-2">
                <span>{tool.label}</span>
                <kbd className="text-canvas-muted-foreground pointer-events-none hidden px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
                  {tool.shortcut}
                </kbd>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
