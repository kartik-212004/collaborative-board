"use client";

import Link from "next/link";
import { ReactNode } from "react";

import Logo from "@/modules/home/logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <Logo />
          </div>
          <span className="text-xl font-semibold">CollabDraw</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
