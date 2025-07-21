import { prisma } from "@repo/database/client";
import express, { Router, Request, Response } from "express";

import { middleware } from "../middleware/middlware";

const router: Router = express.Router();

const handleError = (res: Response, error: unknown, message: string) => {
  console.log(error);
  return res.status(500).json({
    message,
    error: error instanceof Error ? error.message : "Unknown error",
  });
};

const getUserId = (req: Request): string | null => {
  const user = req.user as { id: string } | undefined;
  return user?.id || null;
};

const getRoomSelectFields = (includeCreatedAt = false) => ({
  id: true,
  slug: true,
  adminId: true,
  ...(includeCreatedAt && { createdAt: true }),
});

router.post("/", middleware, async (req, res) => {
  const { slug, type }: { slug: string; type: string } = req.body;
  const adminId = getUserId(req);

  try {
    if (!slug || !adminId) {
      return res.status(400).json({
        message: "No slug or AdminId Provided",
      });
    }

    if (type === "create") {
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
          slug,
          adminId,
        },
        select: getRoomSelectFields(),
      });

      return res.status(201).json({
        message: "Room created successfully",
        room,
      });
    } else if (type === "join") {
      const room = await prisma.room.findUnique({
        where: { slug },
        select: getRoomSelectFields(),
      });

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      return res.status(200).json({
        message: "Room joined successfully",
        room,
      });
    } else {
      return res.status(400).json({
        message: "Invalid type. Must be 'create' or 'join'",
      });
    }
  } catch (error) {
    return handleError(res, error, "Failed to process room request");
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const room = await prisma.room.findUnique({
      where: { slug },
      select: getRoomSelectFields(true),
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
    return handleError(res, error, "Failed to fetch room");
  }
});

router.get("/", middleware, async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

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
    return handleError(res, error, "Failed to fetch rooms");
  }
});

export default router;
