FROM node:20-alpine

WORKDIR /collabdraw

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .

COPY packages ./packages

COPY apps/ws-backend ./apps/ws-backend

RUN npm i -g pnpm && pnpm i

RUN pnpm build:packages
RUN pnpm build --filter ws-backend

EXPOSE 8080

CMD ["pnpm", "dev", "--filter", "ws-backend"]