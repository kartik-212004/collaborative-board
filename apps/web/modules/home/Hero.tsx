"use client";

import Link from "next/link";
import React from "react";

import { ArrowRight, MessageSquareTextIcon, Paintbrush2Icon, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

export function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white pb-10 pt-20 dark:bg-gray-950">
      <div
        className="absolute inset-0 z-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-950/50 dark:to-gray-950"></div>

      <div className="container relative z-10 flex flex-col items-center px-4 text-center">
        <div className="mb-8 inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
          Real-time Collaboration
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl dark:text-gray-100">
          Sketch, Share, Collaborate
        </h1>

        <p className="mx-auto mb-8 mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
          The fastest way to bring your ideas to life. Create, edit, and share diagrams instantly with your
          team in a clean, browser-based whiteboard experience.
        </p>

        <div className="mt-10">
          {isAuthenticated ? (
            <Link href="/rooms">
              <Button className="h-12 bg-gray-900 px-8 text-base font-medium text-white shadow-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button className="h-12 bg-gray-900 px-8 text-base font-medium text-white shadow-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                Start Drawing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div className="relative mt-20 h-[400px] w-full max-w-6xl">
          <div className="absolute left-0 top-10 w-[160px] sm:w-[200px] md:left-20 lg:w-[280px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-2xl transition-all duration-500 hover:grayscale-0">
              <img src="/hero/image2.png" alt="Collaboration" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 right-[-20px] z-20 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Paintbrush2Icon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-[160px] sm:w-[200px] md:right-20 lg:w-[280px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-2xl transition-all duration-500 hover:grayscale-0">
              <img src="/demo.jpeg" alt="Teamwork" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="absolute -left-10 bottom-20 z-20 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-300">
                    <img
                      src="https://i.pravatar.cc/100?img=1"
                      className="h-full w-full object-cover"
                      alt="Team"
                    />
                  </div>
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-300">
                    <img
                      src="https://i.pravatar.cc/100?img=5"
                      className="h-full w-full object-cover"
                      alt="Team"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Collab with</p>
                  <p className="text-lg font-bold leading-none text-gray-900 dark:text-gray-100">
                    multiple users
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 z-20 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-900 text-white shadow-lg dark:border-gray-700">
              <MessageSquareTextIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
