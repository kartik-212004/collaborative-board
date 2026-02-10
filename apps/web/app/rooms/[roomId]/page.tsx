"use client";

import React, { useEffect, useRef, use, useState, useCallback } from "react";

import { PanelLeftClose, PanelLeft, PanelRightClose, PanelRight, Users, MessageCircle } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

import {
  Toolbar,
  ZoomControls,
  CanvasHeader,
  CanvasHint,
  CanvasFooter,
  DrawingCanvas,
  ChatSidebar,
  useCanvasState,
  useKeyboardShortcuts,
  STROKE_COLORS,
  type Shape,
  type DrawMessage,
  type ConnectedUser,
  type ChatMessage,
} from "@/modules/canvas";

export default function DrawingRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { user, isLoading: isAuthLoading } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const showChatRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ConnectedUser | null>(null);
  const [strokeSize, setStrokeSize] = useState(2);
  const [textSize, setTextSize] = useState<"xs" | "md" | "lg" | "xxl">("md");
  const [showControls, setShowControls] = useState(true);
  const [showPresence, setShowPresence] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

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
    undo,
    redo,
    canUndo,
    canRedo,
    addShape,
    updateShape,
    deleteShape,
    updateSelectedShapes,
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

  const handleDeleteSelectedShapesForShortcut = useCallback(() => {
    const selectedIds = canvasState.selectedIds;
    selectedIds.forEach((shapeId) => {
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
    });
  }, [canvasState.selectedIds, deleteShape, roomId, user?.name]);

  useKeyboardShortcuts({
    currentTool: canvasState.tool,
    setTool,
    undo,
    redo,
    deleteSelectedShapes: handleDeleteSelectedShapesForShortcut,
    selectAll,
    deselectAll,
    zoomIn,
    zoomOut,
    resetZoom,
  });
  useEffect(() => {
    setStrokeWidth(strokeSize);
  }, [strokeSize, setStrokeWidth]);
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      setIsConnected(true);

      if (socketRef.current) {
        const joinMessage = {
          name: user?.name || "Anonymous",
          photo: user?.photo,
          type: "join",
          roomId: roomId,
          payload: {},
        };
        socketRef.current.send(JSON.stringify(joinMessage));
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket Error - Could not connect to:", process.env.NEXT_PUBLIC_WS_URL);
      console.error("Make sure ws-backend is running: pnpm --filter ws-backend dev");
      setIsConnected(false);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const message: DrawMessage = JSON.parse(event.data);

        switch (message.type) {
          case "init":
            if (message.payload.shapes) {
              setShapes(message.payload.shapes);
            }
            if (message.payload.users) {
              setConnectedUsers(message.payload.users);
            }
            if (message.payload.user) {
              setCurrentUser(message.payload.user);
            }
            break;
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
            if (message.payload.users) {
              setConnectedUsers(message.payload.users);
            }
            break;
          case "user_left":
            if (message.payload.users) {
              setConnectedUsers(message.payload.users);
            }
            break;
          case "drawing_start":
          case "drawing_end":
            if (message.payload.users) {
              setConnectedUsers(message.payload.users);
            }
            break;
          case "chat":
            console.log("Received chat message:", message.payload.chatMessage);
            if (message.payload.chatMessage) {
              setChatMessages((prev) => [...prev, message.payload.chatMessage!]);
              if (!showChatRef.current) {
                setUnreadChatCount((prev) => prev + 1);
              }
            }
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
  }, [
    roomId,
    user?.name,
    user?.photo,
    isAuthLoading,
    addShape,
    updateShape,
    deleteShape,
    clearCanvas,
    setShapes,
  ]);
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

      if (canvasState.tool !== "select" && canvasState.tool !== "hand" && canvasState.tool !== "eraser") {
        setTool("select");
      }
    },
    [addShape, roomId, user?.name, canvasState.tool, setTool]
  );
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

  const handleUpdateShape = useCallback(
    (shapeId: string, updates: Partial<Shape>) => {
      updateShape(shapeId, updates);

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const updatedShape = canvasState.shapes.find((s) => s.id === shapeId);
        if (updatedShape) {
          const message: DrawMessage = {
            name: user?.name || "Anonymous",
            type: "update",
            roomId: roomId,
            payload: {
              shape: { ...updatedShape, ...updates } as Shape,
              timestamp: Date.now(),
            },
          };
          socketRef.current.send(JSON.stringify(message));
        }
      }
    },
    [updateShape, roomId, user?.name, canvasState.shapes]
  );

  const handleClearCanvas = useCallback(() => {
    clearCanvas();

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message: DrawMessage = {
        name: user?.name || "Anonymous",
        type: "clear",
        roomId: roomId,
        payload: {
          timestamp: Date.now(),
        },
      };
      socketRef.current.send(JSON.stringify(message));
    }
  }, [clearCanvas, roomId, user?.name]);

  const sendDrawingStart = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          name: user?.name || "Anonymous",
          type: "drawing_start",
          roomId: roomId,
          payload: {},
        })
      );
    }
  }, [roomId, user?.name]);

  const sendDrawingEnd = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          name: user?.name || "Anonymous",
          type: "drawing_end",
          roomId: roomId,
          payload: {},
        })
      );
    }
  }, [roomId, user?.name]);

  const sendChatMessage = useCallback(
    (message: string) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            name: user?.name || "Anonymous",
            type: "chat",
            roomId: roomId,
            payload: { message },
          })
        );
      }
    },
    [roomId, user?.name]
  );

  const toggleChat = useCallback((open: boolean) => {
    setShowChat(open);
    showChatRef.current = open;
    if (open) {
      setUnreadChatCount(0);
    }
  }, []);

  const handleStartDrawing = useCallback(
    (point: { x: number; y: number }) => {
      startDrawing(point);
      sendDrawingStart();
    },
    [startDrawing, sendDrawingStart]
  );

  const handleFinishDrawing = useCallback(() => {
    finishDrawing();
    sendDrawingEnd();
  }, [finishDrawing, sendDrawingEnd]);

  return (
    <div className="bg-canvas-background relative h-screen w-screen overflow-hidden">
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
        textSize={textSize}
        selectedIds={canvasState.selectedIds}
        onStartDrawing={handleStartDrawing}
        onUpdateDrawing={updateDrawing}
        onFinishDrawing={handleFinishDrawing}
        onAddShape={handleAddShape}
        onUpdateShape={handleUpdateShape}
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

      <div className="pointer-events-none absolute left-4 right-4 top-4 z-10">
        <div className="pointer-events-auto absolute left-0">
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover flex h-8 w-8 items-center justify-center rounded-lg border shadow-lg">
            {showControls ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="pointer-events-auto flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <Toolbar currentTool={canvasState.tool} onToolChange={setTool} />
            <CanvasHint />
          </div>
        </div>

        <div className="pointer-events-auto absolute right-0 top-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleChat(!showChat)}
            className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover relative flex h-8 w-8 items-center justify-center rounded-lg border shadow-lg">
            <MessageCircle className="h-4 w-4" />
            {unreadChatCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-medium text-white">
                {unreadChatCount > 99 ? "99+" : unreadChatCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowPresence(!showPresence)}
            className="border-canvas-border bg-canvas-toolbar text-canvas-foreground hover:bg-canvas-hover flex h-8 w-8 items-center justify-center rounded-lg border shadow-lg">
            {showPresence ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </button>
          <CanvasHeader roomId={roomId} isConnected={isConnected} connectedUsers={connectedUsers.length} />
        </div>
      </div>

      {showControls && (
        <div className="pointer-events-none absolute left-4 top-20 z-10">
          <div className="bg-canvas-toolbar border-canvas-border text-canvas-foreground pointer-events-auto w-56 rounded-xl border shadow-xl">
            <div className="border-canvas-border flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Controls</span>
            </div>
            <div className="space-y-4 px-4 py-3 text-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-canvas-foreground/90 font-medium">Stroke</span>
                  <span className="text-canvas-muted-foreground text-xs">{strokeSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="border-canvas-border bg-canvas-muted text-canvas-foreground hover:bg-canvas-hover h-8 w-8 rounded-lg border text-sm font-semibold"
                    onClick={() => setStrokeSize((s) => Math.max(1, s - 1))}>
                    –
                  </button>
                  <div className="border-canvas-border bg-canvas-muted text-canvas-muted-foreground flex-1 rounded-lg border px-3 py-1.5 text-center text-xs">
                    {strokeSize}px
                  </div>
                  <button
                    type="button"
                    className="border-canvas-border bg-canvas-muted text-canvas-foreground hover:bg-canvas-hover h-8 w-8 rounded-lg border text-sm font-semibold"
                    onClick={() => setStrokeSize((s) => Math.min(24, s + 1))}>
                    +
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-canvas-foreground/90 font-medium">Color</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {STROKE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setStrokeColor(color);
                        if (canvasState.selectedIds.length > 0) {
                          updateSelectedShapes({ strokeColor: color });
                        }
                      }}
                      className={`h-6 w-6 rounded-md border-2 transition-all ${
                        canvasState.strokeColor === color
                          ? "border-canvas-foreground scale-110"
                          : "hover:border-canvas-foreground/50 border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-canvas-foreground/90 font-medium">Text Size</span>
                </div>
                <div className="flex gap-1">
                  {(["xs", "md", "lg", "xxl"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTextSize(size)}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium uppercase transition-all ${
                        textSize === size
                          ? "border-canvas-foreground bg-canvas-foreground text-canvas-toolbar"
                          : "border-canvas-border bg-canvas-muted text-canvas-muted-foreground hover:bg-canvas-hover"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

      <div className="pointer-events-none absolute bottom-4 right-4 z-10">
        <div className="pointer-events-auto">
          <CanvasFooter />
        </div>
      </div>

      {showPresence && (
        <div className="pointer-events-none absolute right-4 top-20 z-10">
          <div className="bg-canvas-toolbar border-canvas-border text-canvas-foreground pointer-events-auto w-56 rounded-xl border shadow-xl">
            <div className="border-canvas-border flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">People</span>
              <span className="bg-canvas-muted flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium">
                {connectedUsers.length}
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto px-2 py-2">
              {connectedUsers.length === 0 ? (
                <div className="text-canvas-muted-foreground px-2 py-3 text-center text-xs">
                  No one else is here yet
                </div>
              ) : (
                <div className="space-y-1">
                  {connectedUsers.map((u) => (
                    <div
                      key={u.id}
                      className="hover:bg-canvas-hover flex items-center gap-3 rounded-lg px-2 py-2">
                      {u.photo ? (
                        <img
                          src={u.photo}
                          alt={u.name}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                      ) : null}
                      <div
                        className={`text-canvas-foreground flex h-8 w-8 items-center justify-center rounded-full bg-neutral-600 text-xs font-semibold ${u.photo ? "hidden" : ""}`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-canvas-foreground/90 truncate text-sm font-medium">
                            {u.name}
                            {currentUser?.id === u.id && (
                              <span className="text-canvas-muted-foreground ml-1 text-xs">(you)</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          {u.isDrawing ? (
                            <>
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                              <span className="text-emerald-400">Drawing</span>
                            </>
                          ) : (
                            <>
                              <span className="bg-canvas-muted-foreground/50 h-1.5 w-1.5 rounded-full" />
                              <span className="text-canvas-muted-foreground">Idle</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-canvas-border border-t px-4 py-2">
              <div className="flex items-center gap-2 text-xs">
                <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-rose-400"}`} />
                <span className="text-canvas-muted-foreground">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChat && (
        <div
          className="pointer-events-none absolute right-4 z-10"
          style={{ top: showPresence ? "340px" : "80px" }}>
          <div className="pointer-events-auto">
            <ChatSidebar
              messages={chatMessages}
              currentUserId={currentUser?.id ?? null}
              onSendMessage={sendChatMessage}
              isConnected={isConnected}
              isOpen={showChat}
              onClose={() => toggleChat(false)}
              unreadCount={unreadChatCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}
