"use client";

import { useCallback, useEffect } from "react";

import { type Tool, TOOL_SHORTCUTS } from "../types";

interface UseKeyboardShortcutsOptions {
  currentTool: Tool;
  setTool: (tool: Tool) => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedShapes: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export function useKeyboardShortcuts({
  currentTool,
  setTool,
  undo,
  redo,
  deleteSelectedShapes,
  selectAll,
  deselectAll,
  zoomIn,
  zoomOut,
  resetZoom,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (currentTool === "text") {
        if (e.key === "Escape") {
          setTool("select");
        }
        return;
      }

      const key = e.key.toLowerCase();

      if (TOOL_SHORTCUTS[key] && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setTool(TOOL_SHORTCUTS[key]);
        return;
      }

      switch (key) {
        case "v":
          if (!e.ctrlKey && !e.metaKey) setTool("select");
          break;
        case "h":
          if (!e.ctrlKey && !e.metaKey) setTool("hand");
          break;
        case "r":
          if (!e.ctrlKey && !e.metaKey) setTool("rectangle");
          break;
        case "d":
          if (!e.ctrlKey && !e.metaKey) setTool("diamond");
          break;
        case "o":
          if (!e.ctrlKey && !e.metaKey) setTool("ellipse");
          break;
        case "a":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            selectAll();
          } else {
            setTool("arrow");
          }
          break;
        case "l":
          if (!e.ctrlKey && !e.metaKey) setTool("line");
          break;
        case "p":
          if (!e.ctrlKey && !e.metaKey) setTool("pencil");
          break;
        case "t":
          if (!e.ctrlKey && !e.metaKey) setTool("text");
          break;
        case "e":
          if (!e.ctrlKey && !e.metaKey) setTool("eraser");
          break;
      }

      if ((e.ctrlKey || e.metaKey) && key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && key === "y") {
        e.preventDefault();
        redo();
        return;
      }

      if (key === "delete" || key === "backspace") {
        e.preventDefault();
        deleteSelectedShapes();
        return;
      }

      if (key === "escape") {
        deselectAll();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (key === "=" || key === "+")) {
        e.preventDefault();
        zoomIn();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && key === "-") {
        e.preventDefault();
        zoomOut();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && key === "0") {
        e.preventDefault();
        resetZoom();
        return;
      }
    },
    [
      setTool,
      undo,
      redo,
      deleteSelectedShapes,
      selectAll,
      deselectAll,
      zoomIn,
      zoomOut,
      resetZoom,
      currentTool,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
