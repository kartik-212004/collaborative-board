# Dockerfile
FROM node:alpine

WORKDIR /collabdraw

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .env turbo.json ./

COPY packages ./packages

COPY apps/web ./apps/web

RUN npm install -g pnpm \
    && pnpm install

RUN pnpm --filter @repo/prisma build

RUN pnpm build --filter web
RUN pnpm build:packages

EXPOSE 3000

CMD ["pnpm", "dev", "--filter", "web"]
