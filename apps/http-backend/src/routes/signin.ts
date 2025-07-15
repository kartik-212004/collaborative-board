import { User } from "../mongodb/user.mongoose";
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

    const user = await User.findOne({
      email: email,
      password: password,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = sign({ email: user.email }, process.env.SECRET_KEY!);

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      data: {
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
