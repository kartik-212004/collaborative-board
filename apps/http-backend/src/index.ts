import { signinRouter, signupRouter } from "./routes";
import mongoose, { mongo } from "mongoose";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/signup", signupRouter);
app.use("/signin", signinRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

mongoose.connect("mongo://27017");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
