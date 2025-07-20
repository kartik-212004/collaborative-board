"use client";

import React, { useEffect, useRef, use, useState } from "react";

export default function Drawing({ params }: { params: Promise<{ roomId: string }> }) {
  let Xin: number, Yin: number, Xout: number, Yout: number;
  const { roomId } = use(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      let clicked = false;
      canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        Xin = e.clientX;
        Yin = e.clientY;
        console.log(Xin, Yin);
      });
      canvas.addEventListener("mouseup", (e) => {
        clicked = false;
      });
      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          const Xout = e.clientX - Xin;
          const Yout = e.clientY - Yin;
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "black";
          console.log(Xin, Yin, Xout, Yout);
          ctx.strokeRect(Xin, Yin, Xout, Yout);
        }
      });
    }
  }, []);
  return <canvas ref={canvasRef} width={1920} height={925} className="bg-gray-200 text-black"></canvas>;
}
