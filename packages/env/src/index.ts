import { envSchema } from "@repo/zod/type";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const AllEnv = {
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  HTTP_PORT: process.env.HTTP_PORT,
  NODE_ENV: process.env.NODE_ENV,
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT,
  NEXT_PUBLIC_HTTP_BACKEND_URL: process.env.NEXT_PUBLIC_HTTP_BACKEND_URL,
};
const parsed = envSchema.safeParse(AllEnv);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}
const parsedEnv = {
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL!,
  SECRET_KEY: parsed.data.SECRET_KEY!,
  DATABASE_URL: parsed.data.DATABASE_URL!,
  HTTP_PORT: parseInt(parsed.data.HTTP_PORT!),
  NODE_ENV: parsed.data.NODE_ENV!,
  WEBSOCKET_PORT: parseInt(parsed.data.WEBSOCKET_PORT!),
  NEXT_PUBLIC_HTTP_BACKEND_URL: parsed.data.NEXT_PUBLIC_HTTP_BACKEND_URL!,
};

export const {
  SECRET_KEY,
  DATABASE_URL,
  HTTP_PORT,
  NODE_ENV,
  WEBSOCKET_PORT,
  NEXT_PUBLIC_HTTP_BACKEND_URL,
  NEXT_PUBLIC_WS_URL,
} = parsedEnv;
