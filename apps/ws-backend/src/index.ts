import { WEBSOCKET_PORT, SECRET_KEY } from "@repo/env";
import { prisma } from "@repo/prisma/client";
import jwt from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";

const rooms: Record<string, WebSocket[]> = {};

const wss = new WebSocketServer({
  port: WEBSOCKET_PORT,
});

interface MessageType {
  name: string;
  type: "join" | "draw";
  roomId: string;
  payload: {
    Xin: number;
    Yin: number;
    Xout?: number;
    Yout?: number;
    radius?: number;
    shape: "rectangle" | "circle";
    timestamp?: number;
  };
}

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) return;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      ws.close();
      return;
    }
  } catch (error) {
    console.log("Invalid token");
    ws.close();
    return;
  }

  console.log("Client connected");

  ws.on("message", async (data) => {
    try {
      const message: MessageType = JSON.parse(data.toString());
      const {
        roomId,
        name,
        type,
        payload: { Xin, Yin, Xout, Yout, radius, shape },
      } = message;

      switch (type) {
        case "join":
          try {
            const roomExists = await prisma.room.findUnique({
              where: { slug: roomId },
            });

            if (!roomExists) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Room does not exist in database",
                })
              );
            }

            if (!rooms[roomId]) {
              rooms[roomId] = [];
            }

            rooms[roomId].push(ws);

            rooms[roomId].forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "user_joined",
                    roomId,
                    name,
                    payload: { message: `${name} joined the room` },
                  })
                );
              }
            });
          } catch (error) {
            console.log("Database error:", error);
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "Failed to check room existence",
              })
            );
          }
          break;

        case "draw":
          if (
            !Xin ||
            !Yin ||
            !shape ||
            (shape === "rectangle" && (!Xout || !Yout)) ||
            (shape === "circle" && !radius)
          ) {
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid draw payload",
              })
            );
          }
          if (rooms[roomId]) {
            console.log("Insde the check where we see if room is available or not");
            console.log(rooms[roomId].length);
            rooms[roomId].forEach((client) => {
              console.log("rooms[roomId].forEach((client)");
              if (true) {
                console.log("(client !== ws && client.readyState === WebSocket.OPEN)");
                client.send(
                  JSON.stringify({
                    type: "draw",
                    roomId,
                    name,
                    payload: { Xin, Yin, Xout, Yout, radius, shape },
                  })
                );
              }
            });
            console.log("Draw logic ends here");
            console.log(message);
          }
          break;

        default:
          ws.send(
            JSON.stringify({
              type: "error",
              message: `Unknown message type: ${type}`,
            })
          );
          break;
      }
    } catch (error) {
      console.log("Error parsing message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    Object.keys(rooms).forEach((roomId) => {
      if (!rooms[roomId]) return;
      rooms[roomId] = rooms[roomId].filter((client) => client !== ws);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        console.log(`Room ${roomId} deleted (empty)`);
      }
    });
  });
});

console.log(`✅ WebSocket server running on port ${WEBSOCKET_PORT}`);
