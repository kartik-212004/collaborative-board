"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ArrowLeft, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/hooks/use-auth";

export default function RoomsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Users className="h-8 w-8 text-white/50" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">No rooms yet</h3>
          <p className="mb-6 text-white/70">Create your first room to start collaborating with your team.</p>
          <Button className="bg-white text-black hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Room
          </Button>
        </div>
      </div>
    </div>
  );
}
