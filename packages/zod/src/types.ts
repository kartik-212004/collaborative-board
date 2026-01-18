import { z } from "zod";

export const UserType = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string(),
});

export const envSchema = z.object({
  NEXT_PUBLIC_WS_URL: z.string().min(1, "NEXT_PUBLIC_WS_URL"),
  SECRET_KEY: z.string().min(1, "SECRET_KEY is required"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  WEBSOCKET_PORT: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});
