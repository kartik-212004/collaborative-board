"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";

import api from "@/lib/apt";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";

export default function RoomsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  async function handleRoomCreate() {
    setIsCreating(true);
    setError("");

    try {
      const roomCode = generateRoomCode();
      setJoinCode(roomCode);
      const response = await api.post("/room", { slug: roomCode, type: "create" });
      console.log(response);

      if (response.status === 201) {
        setIsCreating(false);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error while creating room");
      setIsCreating(false);
    }
  }

  async function handleRoomJoin() {
    if (!joinCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setError("");
    setIsJoining(true);

    try {
      const token = localStorage.getItem("authToken");

      const response = await api.post("/room", { slug: joinCode, type: "join" });
      console.log(response);
      router.push(`/rooms/${joinCode.toUpperCase()}`);
    } catch (error) {
      console.error("Error joining room:", error);
      setError("Room not found. Please check the code and try again.");
    } finally {
      setIsJoining(false);
    }
  }

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
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">Room</h1>
          <p className="text-white/70">Create a new room or join an existing one</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Single Card */}
        <Card className="border-white/20 bg-white/5">
          <CardContent className="space-y-6 p-6">
            {/* Room Code Input */}
            <div className="space-y-2">
              <Label htmlFor="roomCode" className="text-sm text-white">
                Room Code
              </Label>
              <Input
                id="roomCode"
                type="text"
                placeholder="Enter code (e.g., AHG67)"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  if (error) setError("");
                }}
                maxLength={5}
                className="border-white/20 bg-white/10 text-center font-mono text-lg tracking-wider text-white placeholder:text-white/50 focus:border-white"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRoomCreate}
                disabled={isCreating}
                variant="outline"
                className="w-full border-white/20 text-black hover:bg-white/10 hover:text-white">
                {isCreating ? "Creating Room" : " Create Room"}
              </Button>

              <Button
                onClick={handleRoomJoin}
                disabled={isJoining || !joinCode.trim()}
                className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50">
                {isJoining ? "Joining..." : "Join Room"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            Generate a code to create a new room, or enter an existing code to join
          </p>
        </div>
      </div>
    </div>
  );
}
