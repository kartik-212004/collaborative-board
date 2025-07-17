import { WEBSOCKET_PORT, SECRET_KEY } from "@repo/env";
import jwt from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";

const rooms: Record<string, WebSocket[]> = {};
const wss = new WebSocketServer({
  port: WEBSOCKET_PORT,
});
interface MessageType {
  name: string;
  type: string;
  payload: Record<string, string>;
  roomId: string;
}

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  console.log(token);
  if (!token) return;
  const decoded = jwt.verify(token, SECRET_KEY);

  if (!decoded) {
    console.log("No Token Found");
    ws.close();
    return;
  }

  console.log("Client connected");

  ws.on("message", (client: MessageType) => {
    const message: MessageType = JSON.parse(client.toString());
    console.log("Received:", message);
    const { roomId, name, payload, type } = message;
    switch (message.type) {
      case "create":
        if (!rooms[roomId]) {
          return ws.send(
            JSON.stringify({
              message: "Room Is Booked 💦 ",
            })
          );
        }
        rooms[roomId] = [];
        rooms[roomId]?.push(ws);
        rooms[roomId].map((client) => {
          client.send(
            JSON.stringify({
              name,
              roomId,
              payload: { message: `${name} Created the room` },
              type,
            })
          );
        });

        break;

      case "join":
        if (rooms[roomId]) {
          rooms[roomId].push(ws);
          rooms[roomId].map((client) => {
            client.send(
              JSON.stringify({
                name,
                roomId,
                payload: { message: `${name} Joined the room` },
                type,
              })
            );
          });
        }

        break;

      case "chat":
        if (rooms[roomId]) {
          rooms[roomId].map((client) => {
            client.send(
              JSON.stringify({
                name,
                roomId,
                payload: { message: message },
                type,
              })
            );
          });
        }

        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server running on port ${WEBSOCKET_PORT}`);
