"use client";

import React, { useEffect, useRef, use, useState, useCallback } from "react";

import { PanelLeftClose, PanelLeft } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

import {
  Toolbar,
  ZoomControls,
  CanvasHeader,
  CanvasHint,
  CanvasFooter,
  DrawingCanvas,
  useCanvasState,
  useKeyboardShortcuts,
  STROKE_COLORS,
  type Shape,
  type DrawMessage,
} from "@/modules/canvas";

export default function DrawingRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [strokeSize, setStrokeSize] = useState(2);
  const [showControls, setShowControls] = useState(true);
  const { isAuthenticated, user, isLoading } = useAuth();

  // Canvas state management
  const {
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
    clearCanvas,
    setShapes,
    setSelection,
    setLiveShapes,
    selectShape,
    deselectAll,
    selectAll,
    startDrawing,
    updateDrawing,
    finishDrawing,
  } = useCanvasState();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    currentTool: canvasState.tool,
    setTool,
    undo,
    redo,
    deleteSelectedShapes,
    selectAll,
    deselectAll,
    zoomIn,
    zoomOut,
    resetZoom,
  });

  // Keep stroke width in sync with stroke size control
  useEffect(() => {
    setStrokeWidth(strokeSize);
  }, [strokeSize, setStrokeWidth]);

  // WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      setIsConnected(true);

      if (socketRef.current && user?.name) {
        const joinMessage: DrawMessage = {
          name: user.name,
          type: "join",
          roomId: roomId,
          payload: {},
        };
        socketRef.current.send(JSON.stringify(joinMessage));
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket Error:", err);
      setIsConnected(false);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const message: DrawMessage = JSON.parse(event.data);

        switch (message.type) {
          case "draw":
            if (message.payload.shape) {
              addShape(message.payload.shape);
            }
            break;
          case "update":
            if (message.payload.shape) {
              updateShape(message.payload.shape.id, message.payload.shape);
            }
            break;
          case "delete":
            if (message.payload.shapeId) {
              deleteShape(message.payload.shapeId);
            }
            break;
          case "clear":
            clearCanvas();
            break;
          case "user_joined":
            setConnectedUsers((prev) => prev + 1);
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, user?.name, addShape, updateShape, deleteShape, clearCanvas]);

  // Send shape to other users
  const handleAddShape = useCallback(
    (shape: Shape) => {
      addShape(shape);

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const message: DrawMessage = {
          name: user?.name || "Anonymous",
          type: "draw",
          roomId: roomId,
          payload: {
            shape,
            timestamp: Date.now(),
          },
        };
        socketRef.current.send(JSON.stringify(message));
      }
    },
    [addShape, roomId, user?.name]
  );

  // Send delete to other users
  const handleDeleteShape = useCallback(
    (shapeId: string) => {
      deleteShape(shapeId);

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const message: DrawMessage = {
          name: user?.name || "Anonymous",
          type: "delete",
          roomId: roomId,
          payload: {
            shapeId,
            timestamp: Date.now(),
          },
        };
        socketRef.current.send(JSON.stringify(message));
      }
    },
    [deleteShape, roomId, user?.name]
  );

  return (
    <div className="bg-background relative h-screen w-screen overflow-hidden">
      {/* Drawing Canvas */}
      <DrawingCanvas
        shapes={canvasState.shapes}
        currentShape={drawingState.currentShape}
        tool={canvasState.tool}
        zoom={canvasState.zoom}
        pan={canvasState.pan}
        strokeColor={canvasState.strokeColor}
        strokeWidth={canvasState.strokeWidth}
        fillColor={canvasState.fillColor}
        opacity={canvasState.opacity}
        selectedIds={canvasState.selectedIds}
        onStartDrawing={startDrawing}
        onUpdateDrawing={updateDrawing}
        onFinishDrawing={finishDrawing}
        onAddShape={handleAddShape}
        onSelectShape={selectShape}
        onSetSelection={setSelection}
        onSetLiveShapes={setLiveShapes}
        onCommitShapes={setShapes}
        onDeselectAll={deselectAll}
        onDeleteShape={handleDeleteShape}
        onPanChange={setPan}
        onSetZoom={setZoom}
        isDrawing={drawingState.isDrawing}
        startPoint={drawingState.startPoint}
      />

      {/* Top Header */}
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-10">
        {/* Left - Toggle button */}
        <div className="pointer-events-auto absolute left-0">
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg">
            {showControls ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Center - Toolbar */}
        <div className="pointer-events-auto flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <Toolbar currentTool={canvasState.tool} onToolChange={setTool} />
            <CanvasHint />
          </div>
        </div>

        {/* Right - Header controls */}
        <div className="pointer-events-auto absolute right-0 top-0">
          <CanvasHeader roomId={roomId} isConnected={isConnected} connectedUsers={connectedUsers} />
        </div>
      </div>

      {/* Left sidebar controls */}
      {showControls && (
        <div className="pointer-events-none absolute left-4 top-20 z-10">
          <div className="bg-background pointer-events-auto w-56 rounded-xl border border-white/10 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-sm font-semibold">Controls</span>
            </div>
            <div className="space-y-4 px-4 py-3 text-sm">
              {/* Stroke Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white/90">Stroke</span>
                  <span className="text-xs text-white/50">{strokeSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg border border-white/15 bg-white/5 text-sm font-semibold text-white hover:bg-white/10"
                    onClick={() => setStrokeSize((s) => Math.max(1, s - 1))}>
                    –
                  </button>
                  <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-center text-xs text-white/70">
                    {strokeSize}px
                  </div>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg border border-white/15 bg-white/5 text-sm font-semibold text-white hover:bg-white/10"
                    onClick={() => setStrokeSize((s) => Math.min(24, s + 1))}>
                    +
                  </button>
                </div>
              </div>
              {/* Color Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white/90">Color</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {STROKE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setStrokeColor(color)}
                      className={`h-6 w-6 rounded-md border-2 transition-all ${
                        canvasState.strokeColor === color
                          ? "scale-110 border-white"
                          : "border-transparent hover:border-white/50"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bottom Left - Zoom Controls */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10">
        <div className="pointer-events-auto">
          <ZoomControls
            zoom={canvasState.zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
      </div>

      {/* Bottom Right - Footer */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10">
        <div className="pointer-events-auto">
          <CanvasFooter />
        </div>
      </div>

      {/* Right sidebar for presence */}
      <div className="pointer-events-none absolute right-4 top-20 z-10">
        <div className="bg-background pointer-events-auto w-40 rounded-xl border border-white/10 px-4 py-3 text-white shadow-xl">
          <div className="text-sm font-semibold text-white/90">People</div>
          <div className="mt-2 text-3xl font-bold leading-tight">{connectedUsers}</div>
          <div className="text-xs text-white/50">active {connectedUsers === 1 ? "user" : "users"}</div>
          <div
            className={`mt-3 inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium ${
              isConnected ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
            }`}>
            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-rose-400"}`} />
            {isConnected ? "Online" : "Offline"}
          </div>
        </div>
      </div>
    </div>
  );
}
