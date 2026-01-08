"use client";

import React from "react";

import { Grip } from "lucide-react";

export function FooterBar() {
  const companies = [
    { name: "Alpha", desc: "Design" },
    { name: "MiroClone", desc: "Collaboration" },
    { name: "SketchUp", desc: "Architecture" },
    { name: "EduBoard", desc: "Education" },
  ];

  return (
    <div className="w-full bg-black pb-10 pt-4">
      <div className="flex flex-col items-center">
        <p className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          Quem usa e recomenda
          <Grip className="h-3 w-3" />
        </p>

        <div className="flex flex-wrap justify-center gap-4 px-4">
          {companies.map((c, i) => (
            <div
              key={i}
              className="flex min-w-[200px] items-center justify-center gap-2 rounded border border-white/5 bg-[#111] px-6 py-3 text-gray-300 transition-colors hover:bg-[#1a1a1a]">
              <span className="font-semibold text-white">{c.name}</span>
              <span className="text-gray-600">—</span>
              <span className="text-sm text-gray-500">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
