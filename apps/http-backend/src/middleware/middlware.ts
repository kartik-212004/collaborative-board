import express, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function middleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    // const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

    req.user = decoded;
  } catch (error: any) {
    return res.status(403).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}
