import { prisma } from "@repo/database/client";
import { UserType } from "@repo/zod/type";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password, name, photo } = req.body;
    console.log(email, password, name, photo);
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: password,
        name: name || "Anonymous User",
        photo:
          photo ||
          "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
