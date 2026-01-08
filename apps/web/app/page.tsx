"use client";

import React from "react";

import { Navbar, Hero, FooterBar, Features } from "@/modules/home";

export default function Page() {
  return (
    <main className="text-foreground min-h-screen bg-black font-sans selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <Features />
    </main>
  );
}
