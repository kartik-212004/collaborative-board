"use client";

import Link from "next/link";
import React from "react";

import { Pencil, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="bg-background sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <Pencil className="h-4 w-4 text-black" />
          </div>
          <span className="text-xl font-bold text-white">WhiteBoard</span>
        </Link>

        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-white/10"></div>
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 text-white">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white transition-colors hover:bg-white/10 hover:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="text-white transition-colors hover:bg-white/10 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white text-black transition-colors hover:bg-gray-100">
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
