"use client";

import React, { useEffect, useRef, use, useState } from "react";

import { Button } from "@/components/ui/button";

export default function Drawing({ params }: { params: Promise<{ roomId: string }> }) {
  const [select, setSelect] = useState<"rectangle" | "circle">("circle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const Square = useRef<{ Yin: number; Xin: number; Xout: number; Yout: number }[]>([]);
  const Circle = useRef<{ Yin: number; Xin: number; radius: number; startAngle: number; endAngle: number }[]>(
    []
  );
  let radius = 0;

  let Xin: number, Yin: number, Xout: number, Yout: number;

  let clicked = false;

  function handleMouseDown(e: MouseEvent) {
    clicked = true;
    Xin = e.clientX;
    Yin = e.clientY;
    console.log(Xin, Yin);
  }

  function handleMouseUp(e: MouseEvent) {
    clicked = false;
    Xout = e.clientX - Xin;
    Yout = e.clientY - Yin;
    console.log(Xout, Yout);
    if (select === "rectangle") {
      Square.current.push({ Xin, Yin, Xout, Yout });
    } else if (select === "circle") {
      Circle.current.push({ Xin, Yin, radius, startAngle: 0, endAngle: 2 * Math.PI });
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (clicked) {
      Xout = e.clientX - Xin;
      Yout = e.clientY - Yin;
      console.log(Xout, Yout);
      if (select == "rectangle") {
        if (!ctxRef.current) return;

        ctxRef.current.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctxRef.current.strokeRect(Xin, Yin, Xout, Yout);
        ctxRef.current.strokeStyle = "white";
        Square.current.map((e) => {
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
        Circle.current.map((e) => {
          console.log(Circle);
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
    <div className="relative">
      <div className="absolute bottom-0 flex w-full flex-row justify-center text-center">
        <div className="space-x-4 p-5 font-mono font-extrabold">
          <Button
            onClick={() => {
              setSelect("circle");
            }}
            className={`w-28 text-black hover:bg-green-700 ${select == "circle" ? "bg-green-500" : "bg-white"}`}>
            Circle
          </Button>
          <Button
            onClick={() => {
              setSelect("rectangle");
            }}
            className={`w-28 text-black hover:bg-green-700 ${select == "rectangle" ? "bg-green-500" : "bg-white"}`}>
            Rectangle
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
