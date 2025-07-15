declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      DATABASE_URL: string;
      PORT: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }
}
