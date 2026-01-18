import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@repo/prisma/client";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign({ email: user.email, id: user.id, name: user.name }, process.env.SECRET_KEY!);

    return NextResponse.json(
      {
        success: true,
        message: "Signin successful",
        data: {
          name: user.name,
          photo: user.photo,
          id: user.id,
          email: user.email,
          token: token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
