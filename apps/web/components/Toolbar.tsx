"use client";

import React from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Tool = "rectangle" | "circle";

export default function Toolbar({
  element,
  setelement,
}: {
  element: Tool;
  setelement: (tool: Tool) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={element}
      onValueChange={(val: Tool) => {
        if (val) setelement(val);
      }}
      className="border border-gray-300 bg-white p-2 shadow-sm">
      <ToggleGroupItem
        value="rectangle"
        className="text-black data-[state=on]:bg-black data-[state=on]:text-white">
        Rectangle
      </ToggleGroupItem>
      <ToggleGroupItem
        value="circle"
        className="text-black data-[state=on]:bg-black data-[state=on]:text-white">
        Circle
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
