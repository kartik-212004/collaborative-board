import { UserType } from "@repo/zod/type";
import express, { Router } from "express";
import { User } from "@repo/database/db";
const router: Router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const validationResult = UserType.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validationResult.error.issues,
      });
    }

    if (!email || !password || name) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const newUser = await User.create({
      email: email,
      password: password,
      name: name,
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
