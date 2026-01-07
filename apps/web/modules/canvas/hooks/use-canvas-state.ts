"use client";

import { useCallback, useRef, useState } from "react";

import {
  type CanvasState,
  type DrawingState,
  type HistoryState,
  type Point,
  type Shape,
  type Tool,
  DEFAULT_CANVAS_STATE,
  generateShapeId,
} from "../types";

const MAX_HISTORY_SIZE = 50;

export function useCanvasState(initialShapes: Shape[] = []) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    ...DEFAULT_CANVAS_STATE,
    shapes: initialShapes,
  });

  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    currentShape: null,
  });

  const historyRef = useRef<HistoryState>({
    past: [],
    present: initialShapes,
    future: [],
  });

  const setTool = useCallback((tool: Tool) => {
    setCanvasState((prev) => ({ ...prev, tool }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(5, zoom)),
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.min(5, prev.zoom + 0.1),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: Math.max(0.1, prev.zoom - 0.1),
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 },
    }));
  }, []);

  const setPan = useCallback((pan: Point) => {
    setCanvasState((prev) => ({ ...prev, pan }));
  }, []);

  const setStrokeColor = useCallback((strokeColor: string) => {
    setCanvasState((prev) => ({ ...prev, strokeColor }));
  }, []);

  const setStrokeWidth = useCallback((strokeWidth: number) => {
    setCanvasState((prev) => ({ ...prev, strokeWidth }));
  }, []);

  const setFillColor = useCallback((fillColor: string) => {
    setCanvasState((prev) => ({ ...prev, fillColor }));
  }, []);

  const setOpacity = useCallback((opacity: number) => {
    setCanvasState((prev) => ({ ...prev, opacity }));
  }, []);

  const pushToHistory = useCallback((shapes: Shape[]) => {
    const history = historyRef.current;
    const newPast = [...history.past, history.present].slice(-MAX_HISTORY_SIZE);
    historyRef.current = {
      past: newPast,
      present: shapes,
      future: [],
    };
  }, []);

  const undo = useCallback(() => {
    const history = historyRef.current;
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    historyRef.current = {
      past: newPast,
      present: previous,
      future: [history.present, ...history.future],
    };

    setCanvasState((prev) => ({ ...prev, shapes: previous }));
  }, []);

  const redo = useCallback(() => {
    const history = historyRef.current;
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    historyRef.current = {
      past: [...history.past, history.present],
      present: next,
      future: newFuture,
    };

    setCanvasState((prev) => ({ ...prev, shapes: next }));
  }, []);

  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;
  const addShape = useCallback(
    (shape: Shape) => {
      setCanvasState((prev) => {
        const newShapes = [...prev.shapes, shape];
        pushToHistory(newShapes);
        return { ...prev, shapes: newShapes };
      });
    },
    [pushToHistory]
  );

  const updateShape = useCallback(
    (shapeId: string, updates: Partial<Shape>) => {
      setCanvasState((prev) => {
        const newShapes = prev.shapes.map((shape) =>
          shape.id === shapeId ? ({ ...shape, ...updates } as Shape) : shape
        );
        pushToHistory(newShapes);
        return { ...prev, shapes: newShapes };
      });
    },
    [pushToHistory]
  );

  const deleteShape = useCallback(
    (shapeId: string) => {
      setCanvasState((prev) => {
        const newShapes = prev.shapes.filter((shape) => shape.id !== shapeId);
        pushToHistory(newShapes);
        return {
          ...prev,
          shapes: newShapes,
          selectedIds: prev.selectedIds.filter((id) => id !== shapeId),
        };
      });
    },
    [pushToHistory]
  );

  const updateSelectedShapes = useCallback(
    (updates: Partial<Shape>) => {
      setCanvasState((prev) => {
        if (prev.selectedIds.length === 0) return prev;
        const newShapes = prev.shapes.map((shape) =>
          prev.selectedIds.includes(shape.id) ? ({ ...shape, ...updates } as Shape) : shape
        );
        pushToHistory(newShapes);
        return { ...prev, shapes: newShapes };
      });
    },
    [pushToHistory]
  );

  const deleteSelectedShapes = useCallback(() => {
    setCanvasState((prev) => {
      const newShapes = prev.shapes.filter((shape) => !prev.selectedIds.includes(shape.id));
      pushToHistory(newShapes);
      return { ...prev, shapes: newShapes, selectedIds: [] };
    });
  }, [pushToHistory]);

  const clearCanvas = useCallback(() => {
    pushToHistory([]);
    setCanvasState((prev) => ({ ...prev, shapes: [], selectedIds: [] }));
  }, [pushToHistory]);

  const setShapes = useCallback(
    (shapes: Shape[]) => {
      pushToHistory(shapes);
      setCanvasState((prev) => ({ ...prev, shapes }));
    },
    [pushToHistory]
  );

  const selectShape = useCallback((shapeId: string, addToSelection = false) => {
    setCanvasState((prev) => ({
      ...prev,
      selectedIds: addToSelection ? [...prev.selectedIds, shapeId] : [shapeId],
    }));
  }, []);

  const setSelection = useCallback((shapeIds: string[]) => {
    setCanvasState((prev) => ({ ...prev, selectedIds: shapeIds }));
  }, []);

  const deselectAll = useCallback(() => {
    setCanvasState((prev) => ({ ...prev, selectedIds: [] }));
  }, []);

  const selectAll = useCallback(() => {
    setCanvasState((prev) => ({
      ...prev,
      selectedIds: prev.shapes.map((s) => s.id),
    }));
  }, []);

  const startDrawing = useCallback((point: Point) => {
    setDrawingState({
      isDrawing: true,
      startPoint: point,
      currentPoint: point,
      currentShape: null,
    });
  }, []);

  const updateDrawing = useCallback((point: Point, shape: Shape | null) => {
    setDrawingState((prev) => ({
      ...prev,
      currentPoint: point,
      currentShape: shape,
    }));
  }, []);

  const finishDrawing = useCallback(() => {
    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      currentShape: null,
    });
  }, []);

  const setLiveShapes = useCallback((updater: (prev: Shape[]) => Shape[]) => {
    setCanvasState((prev) => ({ ...prev, shapes: updater(prev.shapes) }));
  }, []);

  return {
    canvasState,
    drawingState,
    setTool,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setPan,
    setStrokeColor,
    setStrokeWidth,
    setFillColor,
    setOpacity,
    undo,
    redo,
    canUndo,
    canRedo,
    addShape,
    updateShape,
    deleteShape,
    deleteSelectedShapes,
    updateSelectedShapes,
    clearCanvas,
    setShapes,
    selectShape,
    deselectAll,
    selectAll,
    setSelection,
    startDrawing,
    updateDrawing,
    finishDrawing,
    setLiveShapes,
  };
}
