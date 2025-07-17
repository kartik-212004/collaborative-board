import { prisma } from "@repo/database/client";
import express, { Router } from "express";

import { middleware } from "../middleware/middlware";

const router: Router = express.Router();

router.post("/", middleware, async (req, res) => {
  const { slug }: { slug: string } = req.body;

  const user = req.user as { id: string };
  const adminId = user?.id;

  try {
    if (!slug || !adminId) {
      return res.status(400).json({
        message: "No slug or AdminId Provided",
      });
    }

    const existingRoom = await prisma.room.findUnique({
      where: { slug },
    });

    if (existingRoom) {
      return res.status(409).json({
        message: "Room with this slug already exists",
      });
    }

    const room = await prisma.room.create({
      data: {
        slug: slug,
        adminId: adminId,
      },
    });

    return res.status(201).json({
      message: "Room created successfully",
      room: {
        id: room.id,
        slug: room.slug,
        adminId: room.adminId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create room",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
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
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch room",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/", middleware, async (req, res) => {
  const user = req.user as { id: string };
  const userId = user?.id;

  try {
    const rooms = await prisma.room.findMany({
      where: {
        adminId: userId,
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

    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch rooms",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
