"use client";

import React, { useEffect, useRef, use, useState } from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

export default function Drawing({ params }: { params: Promise<{ roomId: string }> }) {
  const [select, setSelect] = useState<"rectangle" | "circle">("rectangle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { roomId } = use(params);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const { isAuthenticated, user, isLoading } = useAuth();
  const shapeRef = useRef<"rectangle" | "circle">(select);

  let Square: { Yin: number; Xin: number; Xout: number; Yout: number }[] = [];
  let Circle: { Yin: number; Xin: number; radius: number; startAngle: number; endAngle: number }[] = [];
  let radius = 0;

  let Xin: number, Yin: number, Xout: number, Yout: number;

  let clicked = false;

  interface MessageType {
    name: string;
    type: "join" | "draw";
    roomId: string;
    payload: {
      Xin: number;
      Yin: number;
      Xout?: number;
      Yout?: number;
      radius?: number;
      shape: "rectangle" | "circle";
      timestamp?: number;
    };
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    socketRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL!}?token=${token}`);
    console.log(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);

    socketRef.current.onopen = () => {
      console.log("Connected");
    };

    socketRef.current.onerror = (err) => {
      console.error("Error:", err);
    };

    return () => {
      // socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    shapeRef.current = select;
  }, [select]);

  function handleMouseDown(e: MouseEvent) {
    clicked = true;
    Xin = e.clientX;
    Yin = e.clientY;
    shapeRef.current = select; // Capture shape at mouse down
  }

  function handleMouseUp(e: MouseEvent) {
    clicked = false;
    Xout = e.clientX - Xin;
    Yout = e.clientY - Yin;

    if (shapeRef.current === "circle") {
      console.log("going to circle");
      Circle.push({ Xin, Yin, radius, startAngle: 0, endAngle: 2 * Math.PI });
      socketRef.current?.send(
        JSON.stringify({
          name: user?.name,
          type: "draw",
          roomId: roomId,
          payload: {
            Xin: Xin,
            Yin: Yin,
            radius: radius,
            shape: "circle",
            timestamp: new Date().getTime(),
          },
        })
      );
    } else if (shapeRef.current === "rectangle") {
      console.log("going to rectangle");
      Square.push({ Xin, Yin, Xout, Yout });
      socketRef.current?.send(
        JSON.stringify({
          name: user?.name,
          type: "draw",
          roomId: roomId,
          payload: {
            Xin: Xin,
            Yin: Yin,
            Xout: Xout,
            Yout: Yout,
            shape: "rectangle",
            timestamp: new Date().getTime(),
          },
        })
      );
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (clicked) {
      Xout = e.clientX - Xin;
      Yout = e.clientY - Yin;
      if (select == "rectangle") {
        if (!ctxRef.current) return;

        ctxRef.current.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctxRef.current.strokeRect(Xin, Yin, Xout, Yout);
        ctxRef.current.strokeStyle = "white";
        Square.map((e) => {
          if (!ctxRef.current) return;
          ctxRef.current.strokeStyle = "white";
          ctxRef.current.strokeRect(e.Xin, e.Yin, e.Xout, e.Yout);
        });
      }
      if (select == "circle") {
        if (!ctxRef.current || !canvasRef.current) return;

        ctxRef.current.beginPath();

        radius = Math.sqrt(Math.pow(Xout, 2) + Math.pow(Yout, 2));
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctxRef.current.strokeStyle = "white";
        ctxRef.current.arc(Xin, Yin, radius, 0, 2 * Math.PI);
        ctxRef.current.stroke();
        Circle.map((e) => {
          if (!ctxRef.current || !canvasRef.current) return;
          ctxRef.current.beginPath();
          ctxRef.current.strokeStyle = "white";
          ctxRef.current.arc(e.Xin, e.Yin, e.radius, 0, 2 * Math.PI);
          ctxRef.current.stroke();
        });
      }
    }
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");
    canvas?.addEventListener("mousedown", handleMouseDown);
    canvas?.addEventListener("mouseup", handleMouseUp);
    canvas?.addEventListener("mousemove", handleMouseMove);
  });
  return (
    <div className="relative bg-black">
      <div className="absolute bottom-0 flex w-full flex-row justify-center text-center">
        <div className="space-x-4 p-5 font-mono font-extrabold">
          <Button
            onClick={() => {
              setSelect("rectangle");
            }}
            className={`w-28 text-black hover:bg-green-500 ${select == "rectangle" ? "bg-green-500" : "bg-white"}`}>
            Rectangle
          </Button>
          <Button
            onClick={() => {
              setSelect("circle");
            }}
            className={`w-28 text-black hover:bg-green-500 ${select == "circle" ? "bg-green-500" : "bg-white"}`}>
            Circle
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        className="bg-black"></canvas>
    </div>
  );
}
