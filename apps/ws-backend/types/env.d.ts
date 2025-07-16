declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      WEBSOCKET_PORT: string;
      DATABASE_URL: string;
      HTTP_PORT: string;
      NODE_ENV: string;
    }
  }
}
