import Link from "next/link";
import React from "react";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-black">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="bg-wite flex h-8 w-8 items-center justify-center rounded-lg">
            <Pencil className="h-4 w-4 text-black" />
          </div>
          <span className="text-xl font-bold text-white">WhiteBoard</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/signin">
            <Button
              variant="ghost"
              className="text-white transition-colors hover:bg-white/10 hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-white text-black transition-colors hover:bg-gray-100">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
