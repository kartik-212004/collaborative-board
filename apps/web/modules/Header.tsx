"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

import { LogOut, Github, Sun, Moon, Monitor } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/menu";

import { useAuth } from "@/hooks/use-auth";

import Logo from "./home/logo";

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100">
              • CollabDraw
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-gray-500 md:flex dark:text-gray-400">
            <Link href="/" className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
              Home
            </Link>
            <Link href="/docs" className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
              Docs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/kartik-212004/collaborative-board"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
            <Github className="h-5 w-5" />
          </a>

          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-gray-200 transition-all hover:ring-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600">
                  {user?.photo ? (
                    <AvatarImage src={user.photo} alt={user?.name ?? "Avatar"} />
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Appearance</p>
                </div>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    {theme === "light" && (
                      <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">✓</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    {theme === "dark" && (
                      <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">✓</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                    {theme === "system" && (
                      <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">✓</span>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
