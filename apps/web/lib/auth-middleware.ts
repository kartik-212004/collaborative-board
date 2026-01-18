import { NextRequest, NextResponse } from "next/server";

import { SECRET_KEY } from "@repo/env";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export function verifyAuth(request: NextRequest): AuthUser | NextResponse {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY!) as JwtPayload;

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Invalid or expired token",
        error: error.message,
      },
      { status: 403 }
    );
  }
}

export function isAuthError(result: AuthUser | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
