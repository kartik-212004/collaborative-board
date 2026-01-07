import { WEBSOCKET_PORT, SECRET_KEY } from "@repo/env";
import { prisma } from "@repo/prisma/client";
import http from "http";
import jwt from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(
      JSON.stringify({
        success: true,
        message: "WebSocket server is running",
        timestamp: new Date().toISOString(),
        activeRooms: Object.keys(rooms).length,
        activeConnections: Object.values(rooms).reduce((acc, r) => acc + r.length, 0),
      })
    );
    return;
  }

  res.writeHead(426, { "Content-Type": "text/plain" });
  res.end("Upgrade Required - This is a WebSocket server");
});

const rooms: Record<string, WebSocket[]> = {};

interface ConnectedUser {
  id: string;
  name: string;
  photo?: string;
  isDrawing: boolean;
}

const roomUsers: Record<string, Map<WebSocket, ConnectedUser>> = {};
const wsToRoom: Map<WebSocket, string> = new Map();

function generateUserId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });

// Start the HTTP server
server.listen(WEBSOCKET_PORT, () => {
  console.log(`✅ WebSocket server running on port ${WEBSOCKET_PORT}`);
  console.log(`   Health check available at http://localhost:${WEBSOCKET_PORT}/health`);
});

interface MessageType {
  name: string;
  photo?: string;
  type: "join" | "draw" | "update" | "delete" | "clear" | "drawing_start" | "drawing_end";
  roomId: string;
  payload: {
    shape?: any;
    shapeId?: string;
    timestamp?: number;
    message?: string;
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
      const { roomId, name, photo, type, payload } = message;

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
            if (!roomUsers[roomId]) {
              roomUsers[roomId] = new Map();
            }

            rooms[roomId].push(ws);
            wsToRoom.set(ws, roomId);

            const newUser: ConnectedUser = {
              id: generateUserId(),
              name: name || "Anonymous",
              photo: photo,
              isDrawing: false,
            };
            roomUsers[roomId].set(ws, newUser);

            const existingShapes = await prisma.shape.findMany({
              where: { roomId: roomExists.id },
              orderBy: { createdAt: "asc" },
            });

            const usersList = Array.from(roomUsers[roomId].values());

            ws.send(
              JSON.stringify({
                type: "init",
                roomId,
                payload: {
                  shapes: existingShapes.map((s) => s.data),
                  users: usersList,
                  user: newUser,
                },
              })
            );

            rooms[roomId].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "user_joined",
                    roomId,
                    name,
                    payload: {
                      message: `${name} joined the room`,
                      user: newUser,
                      users: usersList,
                    },
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
          if (!payload.shape) {
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid draw payload - missing shape",
              })
            );
          }
          try {
            const room = await prisma.room.findUnique({ where: { slug: roomId } });
            if (room) {
              await prisma.shape.create({
                data: {
                  id: payload.shape.id,
                  roomId: room.id,
                  data: payload.shape,
                },
              });
            }
          } catch (error) {
            console.log("Error saving shape:", error);
          }
          if (rooms[roomId]) {
            rooms[roomId].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "draw",
                    roomId,
                    name,
                    payload,
                  })
                );
              }
            });
          }
          break;

        case "update":
          if (!payload.shape) {
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid update payload - missing shape",
              })
            );
          }
          try {
            await prisma.shape.update({
              where: { id: payload.shape.id },
              data: { data: payload.shape },
            });
          } catch (error) {
            console.log("Error updating shape:", error);
          }
          if (rooms[roomId]) {
            rooms[roomId].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "update",
                    roomId,
                    name,
                    payload,
                  })
                );
              }
            });
          }
          break;

        case "delete":
          if (!payload.shapeId) {
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid delete payload - missing shapeId",
              })
            );
          }
          try {
            const deleteResult = await prisma.shape.deleteMany({
              where: { id: payload.shapeId },
            });
            console.log(`Deleted ${deleteResult.count} shape(s) with id: ${payload.shapeId}`);
          } catch (error) {
            console.log("Error deleting shape:", error);
          }
          if (rooms[roomId]) {
            rooms[roomId].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "delete",
                    roomId,
                    name,
                    payload,
                  })
                );
              }
            });
          }
          break;

        case "clear":
          try {
            const room = await prisma.room.findUnique({ where: { slug: roomId } });
            if (room) {
              await prisma.shape.deleteMany({
                where: { roomId: room.id },
              });
            }
          } catch (error) {
            console.log("Error clearing shapes:", error);
          }
          if (rooms[roomId]) {
            rooms[roomId].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "clear",
                    roomId,
                    name,
                    payload: {},
                  })
                );
              }
            });
          }
          break;

        case "drawing_start":
          if (roomUsers[roomId]) {
            const user = roomUsers[roomId].get(ws);
            if (user) {
              user.isDrawing = true;
              const usersList = Array.from(roomUsers[roomId].values());
              rooms[roomId]?.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "drawing_start",
                      roomId,
                      payload: { userId: user.id, users: usersList },
                    })
                  );
                }
              });
            }
          }
          break;

        case "drawing_end":
          if (roomUsers[roomId]) {
            const user = roomUsers[roomId].get(ws);
            if (user) {
              user.isDrawing = false;
              const usersList = Array.from(roomUsers[roomId].values());
              rooms[roomId]?.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "drawing_end",
                      roomId,
                      payload: { userId: user.id, users: usersList },
                    })
                  );
                }
              });
            }
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

    const roomId = wsToRoom.get(ws);
    if (!roomId || !rooms[roomId]) {
      wsToRoom.delete(ws);
      return;
    }

    const leavingUser = roomUsers[roomId]?.get(ws);

    rooms[roomId] = rooms[roomId].filter((client) => client !== ws);
    roomUsers[roomId]?.delete(ws);
    wsToRoom.delete(ws);

    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
      delete roomUsers[roomId];
      console.log(`Room ${roomId} deleted (empty)`);
    } else if (leavingUser) {
      const usersList = Array.from(roomUsers[roomId]?.values() || []);
      rooms[roomId].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "user_left",
              roomId,
              payload: { userId: leavingUser.id, users: usersList },
            })
          );
        }
      });
    }
  });
});

console.log(`✅ WebSocket server running on port ${WEBSOCKET_PORT}`);
