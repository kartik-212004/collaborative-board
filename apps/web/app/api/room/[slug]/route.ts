import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@repo/prisma/client";

// GET /api/room/[slug] - Get a specific room by slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const room = await prisma.room.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        adminId: true,
        createdAt: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          message: "Room not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Fetch room error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch room",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
