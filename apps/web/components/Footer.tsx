import Link from "next/link";
import React from "react";

import { Pencil } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-8 text-white sm:py-12">
      <div className="container mx-auto max-w-6xl">
        {/* Brand Section - Full width on mobile */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-center space-x-2 sm:justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <Pencil className="h-4 w-4 text-black" />
            </div>
            <span className="text-xl font-bold">WhiteBoard</span>
          </div>
          <p className="mx-auto max-w-xs text-center text-sm text-white/70 sm:mx-0 sm:text-left sm:text-base">
            The fastest collaborative whiteboard for modern teams.
          </p>
        </div>

        {/* Links Grid - 3 columns on mobile, 4 on larger screens */}
        <div className="grid grid-cols-3 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Product Section */}
          <div>
            <h4 className="mb-4 text-center text-sm font-semibold sm:text-left sm:text-base">Product</h4>
            <ul className="space-y-3 text-center text-xs text-white/70 sm:text-left sm:text-sm">
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="mb-4 text-center text-sm font-semibold sm:text-left sm:text-base">Company</h4>
            <ul className="space-y-3 text-center text-xs text-white/70 sm:text-left sm:text-sm">
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="mb-4 text-center text-sm font-semibold sm:text-left sm:text-base">Support</h4>
            <ul className="space-y-3 text-center text-xs text-white/70 sm:text-left sm:text-sm">
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-white focus:text-white focus:outline-none">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-6 border-t border-white/10 pt-6 text-center text-white/70 sm:mt-8 sm:pt-8">
          <p className="text-sm sm:text-base">&copy; 2025 WhiteBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
