import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
const rooms: Record<string, WebSocket[]> = {};
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) return;
  const decoded = jwt.verify(token, process.env.SECRET_KEY!);
  if (!decoded) {
    wss.close;
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
