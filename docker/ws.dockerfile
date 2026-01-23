FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY . .

RUN pnpm install

RUN pnpm --filter @repo/zod build
RUN pnpm --filter @repo/env build
RUN pnpm --filter @repo/prisma build

RUN cd apps/ws-backend && pnpm build

EXPOSE 8080

CMD ["node", "apps/ws-backend/dist/index.js"]
