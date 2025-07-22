"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import api from "@/lib/apt";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";

export default function RoomsPage() {
  const { isAuthenticated, isLoading, token } = useAuth(); // Assuming token is available
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

  // WebSocket connection function
  const connectWebSocket = (roomCode: string, userName: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Replace with your actual WebSocket server URL and port
    const wsUrl = `ws://localhost:${process.env.NEXT_PUBLIC_WEBSOCKET_PORT || 8080}?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      // Send join message
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
            // Handle drawing events
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

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection error");
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

        // Connect to WebSocket after room creation
        // You might want to get the user's name from auth context or ask for it
        const userName = "User"; // Replace with actual username
        connectWebSocket(roomCode, userName);

        // Navigate to room
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

      // Connect to WebSocket after successful join
      const userName = "User"; // Replace with actual username
      connectWebSocket(joinCode.toUpperCase(), userName);

      router.push(`/rooms/${joinCode.toUpperCase()}`);
    } catch (error) {
      console.error("Error joining room:", error);
      setError("Room not found. Please check the code and try again.");
    } finally {
      setIsJoining(false);
    }
  }

  // Function to send draw messages (call this from your drawing component)
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
          name: "User", // Replace with actual username
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

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

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
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto my-4 max-w-md">
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

            <div className="space-y-3">
              <Button
                onClick={handleRoomCreate}
                disabled={isCreating}
                variant="outline"
                className="w-full border-white/20 text-black hover:bg-white/10 hover:text-white">
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
          <p className="text-sm text-white/60">
            Generate a code to create a new room, or enter an existing code to join
          </p>
        </div>
      </div>
    </div>
  );
}
