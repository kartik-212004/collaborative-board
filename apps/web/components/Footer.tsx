import Link from "next/link";
import React from "react";

import { Pencil } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <Pencil className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold">WhiteBoard</span>
            </div>
            <p className="text-white/70">The fastest collaborative whiteboard for modern teams.</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Product</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Updates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-white/70">
          <p>&copy; 2025 WhiteBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
