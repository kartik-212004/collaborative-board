# Dockerfile
FROM node:alpine

WORKDIR /collabdraw

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY packages ./packages

COPY apps/web ./apps/web

RUN npm install -g pnpm \
    && pnpm install

RUN  pnpm build:packages
RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "dev", "--filter", "web"]
