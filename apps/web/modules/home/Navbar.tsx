"use client";

import Link from "next/link";
import React from "react";

import { User, Grip, LogOut } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

import Logo from "./logo";

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-12 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600/20 p-1">
            <Logo />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CollabDraw</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex"></nav>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded bg-white/10" />
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 text-white">
                <Avatar>
                  {user?.photo ? (
                    <AvatarImage src={user.photo} alt={user?.name ?? "Avatar"} />
                  ) : (
                    <AvatarFallback>{user?.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="px-2 text-white hover:bg-white/10 hover:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" className="px-2 text-white hover:bg-white/10 hover:text-white">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="border-0 bg-blue-600 px-2 font-medium text-white hover:bg-blue-700">
                  Try for free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
