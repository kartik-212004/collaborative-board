import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "wsapp" });
});

app.listen(3000, () => {
  console.log("Server is running wild");
});
