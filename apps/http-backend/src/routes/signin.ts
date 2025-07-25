import { SECRET_KEY } from "@repo/env";
import { prisma } from "@repo/prisma/client";
import express, { Router } from "express";
import { sign } from "jsonwebtoken";

const router: Router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = sign({ email: user.email, id: user.id, name: user.name }, SECRET_KEY);

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      data: {
        name: user.name,
        photo: user.photo,
        id: user.id,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
