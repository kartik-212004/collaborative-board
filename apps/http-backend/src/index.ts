import { HTTP_PORT } from "@repo/env";
import cors from "cors";
import express from "express";

import roomRouter from "./routes/room";
import signinRouter from "./routes/signin";
import signupRouter from "./routes/signup";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/signup", signupRouter);
app.use("/signin", signinRouter);
app.use("/room", roomRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is running on port ${HTTP_PORT}`);
});
