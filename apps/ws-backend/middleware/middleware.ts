import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function middleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ message: "No Token Provided" });
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(403).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}
