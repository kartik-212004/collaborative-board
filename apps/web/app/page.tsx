"use client";

import React from "react";

import Footer from "@/modules/Footer";
import { Navbar, Hero, Features } from "@/modules/home";

export default function Page() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
