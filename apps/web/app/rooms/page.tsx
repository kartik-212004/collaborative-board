"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import api from "@/lib/apt";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";

import { Navbar } from "@/modules/home";

export default function RoomsPage() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const connectWebSocket = (roomCode: string, userName: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"}?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      if (wsRef.current) {
        wsRef.current.send(
          JSON.stringify({
            name: userName,
            type: "join",
            roomId: roomCode,
            payload: {
              Xin: 0,
              Yin: 0,
              shape: "rectangle",
            },
          })
        );
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);

        switch (message.type) {
          case "user_joined":
            console.log(message.payload.message);
            break;
          case "draw":
            console.log("Draw event:", message.payload);
            break;
          case "error":
            setError(message.message);
            break;
          default:
            console.log("Unknown message type:", message.type);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  async function handleRoomCreate() {
    setIsCreating(true);
    setError("");

    try {
      const roomCode = generateRoomCode();

      const response = await api.post("/room", { slug: roomCode, type: "create" });
      console.log(response);

      if (response.status === 201) {
        setIsCreating(false);
        setJoinCode(roomCode);

        const userName = "User";
        connectWebSocket(roomCode, userName);

        router.push(`/rooms/${roomCode}`);
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
      const response = await api.post("/room", { slug: joinCode, type: "join" });
      console.log(response);

      const userName = "User";
      connectWebSocket(joinCode.toUpperCase(), userName);

      router.push(`/rooms/${joinCode.toUpperCase()}`);
    } catch (error) {
      console.error("Error joining room:", error);
      setError("Room not found. Please check the code and try again.");
    } finally {
      setIsJoining(false);
    }
  }

  const sendDrawMessage = (drawData: {
    Xin: number;
    Yin: number;
    Xout?: number;
    Yout?: number;
    radius?: number;
    shape: "rectangle" | "circle";
  }) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          name: "User",
          type: "draw",
          roomId: joinCode,
          payload: drawData,
        })
      );
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        <div className="relative z-10 text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto max-w-md pb-10 pt-24">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">Room</h1>
            <p className="text-white/70">Create a new room or join an existing one</p>
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <Card className="border-white/20 bg-white/5">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="roomCode" className="pb-2 text-sm text-white">
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
                  unstyled
                  className="w-full"
                  inputClassName="auth-input text-center font-mono text-lg tracking-wider"
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleRoomCreate}
                  disabled={isCreating}
                  variant="outline"
                  className="w-full border-white/20 hover:bg-white/10 hover:text-white/70">
                  {isCreating ? "Creating Room" : "Create Room"}
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

          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">server might take 10-15 seconds to spin up</p>
          </div>
        </div>
      </div>
    </div>
  );
}
