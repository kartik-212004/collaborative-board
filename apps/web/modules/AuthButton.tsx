"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";

interface AuthButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export default function AuthButton({ children, className, size = "lg" }: AuthButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push("/rooms");
    } else {
      router.push("/signup");
    }
  };

  if (isLoading) {
    return (
      <Button size={size} className={className} disabled>
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button size={size} className={className} onClick={handleClick}>
        Join Room
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button size={size} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}
