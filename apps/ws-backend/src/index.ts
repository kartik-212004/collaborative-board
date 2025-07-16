import { WEBSOCKET_PORT, SECRET_KEY } from "@repo/env";
import jwt from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";

const rooms: Record<string, WebSocket[]> = {};
const wss = new WebSocketServer({
  port: WEBSOCKET_PORT,
});

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) return;
  const decoded = jwt.verify(token, SECRET_KEY);
  if (!decoded) {
    ws.close();
    return;
  }

  console.log("Client connected");

  ws.on("message", (data) => {
    const message = data.toString();
    console.log("Received:", message);

    ws.send("hello " + message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server running on port ${WEBSOCKET_PORT}`);
