"use client";

import React, { useEffect, useRef, use, useState } from "react";

import Toolbar from "@/components/Toolbar";

export default function Drawing({ params }: { params: Promise<{ roomId: string }> }) {
  const [select, setSelect] = useState<"rectangle" | "circle">("circle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  let Square: { Yin: number; Xin: number; Xout: number; Yout: number }[] = [];
  let Circle: { Yin: number; Xin: number; radius: number; startAngle: number; endAngle: number }[] = [];
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
    Square.push({ Xin, Yin, Xout, Yout });
    Circle.push({ Xin, Yin, radius, startAngle: 0, endAngle: 2 * Math.PI });
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
        Square.map((e) => {
          if (!ctxRef.current) return;
          ctxRef.current.strokeRect(e.Xin, e.Yin, e.Xout, e.Yout);
        });
      }
      if (select == "circle") {
        if (!ctxRef.current || !canvasRef.current) return;

        ctxRef.current.beginPath();

        radius = Math.sqrt(Math.pow(Xout, 2) + Math.pow(Yout, 2));
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctxRef.current.arc(Xin, Yin, radius, 0, 2 * Math.PI);
        ctxRef.current.stroke();
        Circle.map((e) => {
          console.log(Circle);
          if (!ctxRef.current || !canvasRef.current) return;
          ctxRef.current.beginPath();
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
    <>
      <div></div>
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        className="bg-gray-100"></canvas>
    </>
  );
}
