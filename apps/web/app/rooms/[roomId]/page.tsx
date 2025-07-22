"use client";

import React, { useEffect, useRef, use, useState } from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

export default function Drawing({ params }: { params: Promise<{ roomId: string }> }) {
  const [select, setSelect] = useState<"rectangle" | "circle">("rectangle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { roomId } = use(params);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const { isAuthenticated, user, isLoading } = useAuth();
  const shapeRef = useRef<"rectangle" | "circle">(select);

  const shapesRef = useRef<{
    squares: { Yin: number; Xin: number; Xout: number; Yout: number }[];
    circles: { Yin: number; Xin: number; radius: number }[];
  }>({
    squares: [],
    circles: [],
  });

  const drawingStateRef = useRef<{
    Xin: number;
    Yin: number;
    Xout: number;
    Yout: number;
    radius: number;
    clicked: boolean;
  }>({
    Xin: 0,
    Yin: 0,
    Xout: 0,
    Yout: 0,
    radius: 0,
    clicked: false,
  });

  interface MessageType {
    name: string;
    type: "join" | "draw" | "user_joined" | "error" | "clear";
    roomId: string;
    payload: {
      Xin: number;
      Yin: number;
      Xout?: number;
      Yout?: number;
      radius?: number;
      shape: "rectangle" | "circle";
      timestamp?: number;
      message?: string;
    };
  }

  const redrawCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;

    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctxRef.current.strokeStyle = "white";
    ctxRef.current.lineWidth = 2;

    shapesRef.current.squares.forEach((rect) => {
      if (ctxRef.current) {
        ctxRef.current.strokeRect(rect.Xin, rect.Yin, rect.Xout, rect.Yout);
      }
    });

    shapesRef.current.circles.forEach((circle) => {
      if (ctxRef.current) {
        ctxRef.current.beginPath();
        ctxRef.current.arc(circle.Xin, circle.Yin, circle.radius, 0, 2 * Math.PI);
        ctxRef.current.stroke();
      }
    });
  };

  const clearCanvas = () => {
    shapesRef.current.squares = [];
    shapesRef.current.circles = [];

    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        name: user?.name || "Anonymous",
        type: "clear" as const,
        roomId: roomId,
        payload: {
          Xin: 0,
          Yin: 0,
          shape: "rectangle" as const,
          timestamp: new Date().getTime(),
        },
      };
      socketRef.current.send(JSON.stringify(message));
    }
  };

  const getCanvasCoordinates = (e: MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    socketRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);

    socketRef.current.onopen = () => {
      setIsConnected(true);

      if (socketRef.current && user?.name) {
        const joinMessage = {
          name: user.name,
          type: "join",
          roomId: roomId,
          payload: {
            Xin: 0,
            Yin: 0,
            shape: "rectangle" as const,
          },
        };
        socketRef.current.send(JSON.stringify(joinMessage));
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket Error:", err);
      setIsConnected(false);
    };

    socketRef.current.onclose = (event) => {
      setIsConnected(false);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const message: MessageType = JSON.parse(event.data);

        if (message.type === "draw") {
          const payload = message.payload;

          if (payload.shape === "rectangle" && payload.Xout !== undefined && payload.Yout !== undefined) {
            shapesRef.current.squares.push({
              Xin: payload.Xin,
              Yin: payload.Yin,
              Xout: payload.Xout,
              Yout: payload.Yout,
            });
          } else if (payload.shape === "circle" && payload.radius !== undefined) {
            shapesRef.current.circles.push({
              Xin: payload.Xin,
              Yin: payload.Yin,
              radius: payload.radius,
            });
          }

          redrawCanvas();
        } else if (message.type === "clear") {
          shapesRef.current.squares = [];
          shapesRef.current.circles = [];

          if (ctxRef.current && canvasRef.current) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        } else if (message.type === "user_joined") {
        } else if (message.type === "error") {
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
  }, [roomId, user?.name]);

  useEffect(() => {
    shapeRef.current = select;
  }, [select]);

  function handleMouseDown(e: MouseEvent) {
    const coords = getCanvasCoordinates(e);
    drawingStateRef.current.clicked = true;
    drawingStateRef.current.Xin = coords.x;
    drawingStateRef.current.Yin = coords.y;
  }

  function handleMouseUp(e: MouseEvent) {
    if (!drawingStateRef.current.clicked) return;

    const coords = getCanvasCoordinates(e);
    drawingStateRef.current.clicked = false;
    drawingStateRef.current.Xout = coords.x - drawingStateRef.current.Xin;
    drawingStateRef.current.Yout = coords.y - drawingStateRef.current.Yin;

    const { Xin, Yin, Xout, Yout, radius } = drawingStateRef.current;

    if (shapeRef.current === "circle") {
      shapesRef.current.circles.push({ Xin, Yin, radius });

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const message = {
          name: user?.name || "Anonymous",
          type: "draw",
          roomId: roomId,
          payload: {
            Xin: Xin,
            Yin: Yin,
            radius: radius,
            shape: "circle" as const,
            timestamp: new Date().getTime(),
          },
        };
        socketRef.current.send(JSON.stringify(message));
      }
    } else if (shapeRef.current === "rectangle") {
      shapesRef.current.squares.push({ Xin, Yin, Xout, Yout });

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const message = {
          name: user?.name || "Anonymous",
          type: "draw",
          roomId: roomId,
          payload: {
            Xin: Xin,
            Yin: Yin,
            Xout: Xout,
            Yout: Yout,
            shape: "rectangle" as const,
            timestamp: new Date().getTime(),
          },
        };
        socketRef.current.send(JSON.stringify(message));
      }
    }

    redrawCanvas();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!drawingStateRef.current.clicked) return;

    const coords = getCanvasCoordinates(e);
    drawingStateRef.current.Xout = coords.x - drawingStateRef.current.Xin;
    drawingStateRef.current.Yout = coords.y - drawingStateRef.current.Yin;

    const { Xin, Yin, Xout, Yout } = drawingStateRef.current;

    if (!ctxRef.current || !canvasRef.current) return;

    if (select === "rectangle") {
      redrawCanvas();
      ctxRef.current.strokeStyle = "white";
      ctxRef.current.strokeRect(Xin, Yin, Xout, Yout);
    } else if (select === "circle") {
      drawingStateRef.current.radius = Math.sqrt(Math.pow(Xout, 2) + Math.pow(Yout, 2));
      redrawCanvas();
      ctxRef.current.beginPath();
      ctxRef.current.strokeStyle = "white";
      ctxRef.current.arc(Xin, Yin, drawingStateRef.current.radius, 0, 2 * Math.PI);
      ctxRef.current.stroke();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = "white";
      ctxRef.current.lineWidth = 2;
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [select]);

  return (
    <div className="relative bg-black">
      <div className="absolute right-4 top-4 z-10">
        <div
          className={`rounded px-3 py-1 text-sm ${isConnected ? "bg-green-500" : "bg-red-500"} text-white`}>
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div className="absolute bottom-0 flex w-full flex-row justify-center text-center">
        <div className="space-x-4 p-5 font-mono font-extrabold">
          <Button
            onClick={() => setSelect("rectangle")}
            className={`w-28 text-black hover:bg-green-500 ${select === "rectangle" ? "bg-green-500" : "bg-white"}`}>
            Rectangle
          </Button>
          <Button
            onClick={() => setSelect("circle")}
            className={`w-28 text-black hover:bg-green-500 ${select === "circle" ? "bg-green-500" : "bg-white"}`}>
            Circle
          </Button>
          <Button
            onClick={() => navigator.clipboard.writeText(roomId)}
            className="w-28 border border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
            COPY CODE
          </Button>
          <Button onClick={clearCanvas} className="w-28 bg-red-600 text-white hover:bg-red-700">
            CLEAR
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        height={typeof window !== "undefined" ? window.innerHeight : 927}
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        className="bg-black"
      />
    </div>
  );
}
