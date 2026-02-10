import Link from "next/link";
import React from "react";

import { Pencil } from "lucide-react";

import Logo from "./home/logo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8 text-gray-900 sm:py-12 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-center space-x-2 sm:justify-start">
            <span className="text-base font-bold tracking-tight">• CollabDraw</span>
          </div>
          <p className="mx-auto max-w-xs text-center text-sm text-gray-500 sm:mx-0 sm:text-left sm:text-base dark:text-gray-400">
            The fastest collaborative whiteboard for modern teams.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-4 text-center text-sm font-semibold text-gray-900 sm:text-left sm:text-base dark:text-gray-100">
              Product
            </h4>
            <ul className="space-y-3 text-center text-xs text-gray-500 sm:text-left sm:text-sm dark:text-gray-400">
              <li>
                <Link
                  href="/docs"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-center text-sm font-semibold text-gray-900 sm:text-left sm:text-base dark:text-gray-100">
              Company
            </h4>
            <ul className="space-y-3 text-center text-xs text-gray-500 sm:text-left sm:text-sm dark:text-gray-400">
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-center text-sm font-semibold text-gray-900 sm:text-left sm:text-base dark:text-gray-100">
              Support
            </h4>
            <ul className="space-y-3 text-center text-xs text-gray-500 sm:text-left sm:text-sm dark:text-gray-400">
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none dark:hover:text-gray-100 dark:focus:text-gray-100">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 text-center text-gray-400 sm:mt-8 sm:pt-8 dark:border-gray-800 dark:text-gray-500">
          <p className="text-sm sm:text-base">&copy; 2025 CollabDraw. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
