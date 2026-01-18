import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@repo/prisma/client";

import { AuthUser, isAuthError, verifyAuth } from "@/lib/auth-middleware";

const getRoomSelectFields = (includeCreatedAt = false) => ({
  id: true,
  slug: true,
  adminId: true,
  ...(includeCreatedAt && { createdAt: true }),
});

// POST /api/room - Create or join a room
export async function POST(request: NextRequest) {
  const authResult = verifyAuth(request);
  if (isAuthError(authResult)) {
    return authResult;
  }
  const user: AuthUser = authResult;

  try {
    const { slug, type }: { slug: string; type: string } = await request.json();

    if (!slug) {
      return NextResponse.json(
        {
          message: "No slug provided",
        },
        { status: 400 }
      );
    }

    if (type === "create") {
      const existingRoom = await prisma.room.findUnique({
        where: { slug },
      });

      if (existingRoom) {
        return NextResponse.json(
          {
            message: "Room with this slug already exists",
          },
          { status: 409 }
        );
      }

      const room = await prisma.room.create({
        data: {
          slug,
          adminId: user.id,
        },
        select: getRoomSelectFields(),
      });

      return NextResponse.json(
        {
          message: "Room created successfully",
          room,
        },
        { status: 201 }
      );
    } else if (type === "join") {
      const room = await prisma.room.findUnique({
        where: { slug },
        select: getRoomSelectFields(),
      });

      if (!room) {
        return NextResponse.json(
          {
            message: "Room not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Room joined successfully",
          room,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Invalid type. Must be 'create' or 'join'",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Room error:", error);
    return NextResponse.json(
      {
        message: "Failed to process room request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/room - Get all rooms for authenticated user
export async function GET(request: NextRequest) {
  const authResult = verifyAuth(request);
  if (isAuthError(authResult)) {
    return authResult;
  }
  const user: AuthUser = authResult;

  try {
    const rooms = await prisma.room.findMany({
      where: {
        adminId: user.id,
      },
      select: {
        id: true,
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch rooms",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
