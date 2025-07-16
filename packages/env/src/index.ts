import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const requiredEnvVars = {
  SECRET_KEY: process.env.SECRET_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  HTTP_PORT: process.env.HTTP_PORT,
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT,
  NODE_ENV: process.env.NODE_ENV,
} as const;

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
}

export const env = {
  DATABASE_URL: requiredEnvVars.DATABASE_URL!,
  SECRET_KEY: requiredEnvVars.SECRET_KEY!,
  HTTP_PORT: parseInt(requiredEnvVars.HTTP_PORT!) || 3000,
  WEBSOCKET_PORT: parseInt(requiredEnvVars.WEBSOCKET_PORT!) || 8080,
  NODE_ENV: requiredEnvVars.NODE_ENV! as "development" | "production" | "test",
  isDevelopment: requiredEnvVars.NODE_ENV === "development",
  isProduction: requiredEnvVars.NODE_ENV === "production",
  isTest: requiredEnvVars.NODE_ENV === "test",
} as const;

export const {
  DATABASE_URL,
  SECRET_KEY,
  HTTP_PORT,
  WEBSOCKET_PORT,
  NODE_ENV,
  isDevelopment,
  isProduction,
  isTest,
} = env;

export default env;
