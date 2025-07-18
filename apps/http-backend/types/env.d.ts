declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      DATABASE_URL: string;
      PORT: number;
      NODE_ENV: "development" | "production" | "test";
      WEBSOCKET_PORT: number;
    }
  }
}
