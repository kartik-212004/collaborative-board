FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY . .

RUN pnpm install

RUN pnpm --filter @repo/zod build
RUN pnpm --filter @repo/env build
RUN pnpm --filter @repo/prisma build

RUN cd apps/web && pnpm build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]
