import { WebSocket, WebSocketServer } from "ws";

const rooms: Record<string, WebSocket[]> = {};
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
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
