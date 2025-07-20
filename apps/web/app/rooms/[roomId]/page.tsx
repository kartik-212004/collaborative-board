"use client";

import React, { useEffect, useRef, use, useState } from "react";

import Toolbar from "@/components/Toolbar";

export default function Drawing({ params }: { params: Promise<{ roomId: string }> }) {
  let Xin: number, Yin: number, Xout: number, Yout: number;
  const { roomId } = use(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [element, setelement] = useState<"rectangle" | "circle">("circle");
  const Square: { Xin: number; Yin: number; Xout: number; Yout: number }[] = [];
  const Circle: { Xin: number; Yin: number; radius: number; startAngle: number; endAngle: number }[] = [];

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      let clicked = false;
      canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        Xin = e.clientX;
        Yin = e.clientY;
      });
      canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        Xout = e.offsetX - Xin;
        Yout = e.offsetY - Yin;
        if (element == "rectangle") {
          Square.push({ Xin, Yin, Xout, Yout });
        } else if (element == "circle") {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const dx = mouseX - Xin;
          const dy = mouseY - Yin;
          const radius = Math.sqrt(dx * dx + dy * dy);

          Circle.push({
            Xin,
            Yin,
            radius,
            startAngle: 0,
            endAngle: 2 * Math.PI,
          });
        }
      });
      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          if (element == "rectangle") {
            const Xout = e.clientX - Xin;
            const Yout = e.clientY - Yin;
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "black";
            ctx.strokeRect(Xin, Yin, Xout, Yout);
            Square.map((e) => {
              ctx.strokeRect(e.Xin, e.Yin, e.Xout, e.Yout);
            });

            Circle.map((e) => {
              ctx.beginPath();
              ctx.arc(e.Xin, e.Yin, e.radius, 0, 2 * Math.PI);

              ctx.strokeStyle = "black";
              ctx.stroke();
            });
          }
          if (element === "circle") {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const dx = mouseX - Xin;
            const dy = mouseY - Yin;

            const radius = Math.sqrt(dx * dx + dy * dy);

            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            Square.map((e) => {
              ctx.strokeRect(e.Xin, e.Yin, e.Xout, e.Yout);
            });

            Circle.map((e) => {
              ctx.beginPath();
              ctx.arc(e.Xin, e.Yin, e.radius, 0, 2 * Math.PI);
              ctx.stroke();
            });

            ctx.beginPath();
            ctx.arc(Xin, Yin, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = "black";
            ctx.stroke();
          }
        }
      });
    }
  }, []);
  return (
    <>
      <Toolbar element={element} setelement={setelement} />
      <canvas ref={canvasRef} width={1920} height={925} className="bg-gray-200 text-black"></canvas>;
    </>
  );
}
