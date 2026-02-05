.PHONY: build-web build-backend build run run-web run-backend stop clean help network

NETWORK_NAME=collabdraw-network

help:
	@echo "Available commands:"
	@echo "  make build          - Build both frontend and backend images"
	@echo "  make build-web      - Build frontend image only"
	@echo "  make build-backend  - Build backend image only"
	@echo "  make run            - Run database, frontend and backend containers"
	@echo "  make stop           - Stop all containers"
	@echo "  make clean          - Remove containers and images"
	@echo "  make start          - Build and run everything"

build: build-web build-backend

start: build run 

build-web:
	@echo "Building frontend image..."
	docker build --no-cache -f ./docker/web.dockerfile -t frontend .

build-backend:
	@echo "Building backend image..."
	docker build --no-cache -f ./docker/ws.dockerfile -t backend .

network:
	@docker network inspect $(NETWORK_NAME) >/dev/null 2>&1 || docker network create $(NETWORK_NAME)

run: network
	@echo "Starting database..."
	@docker compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 5
	@echo "Running database migrations..."
	@docker run --rm --network $(NETWORK_NAME) frontend pnpm --filter @repo/prisma db:push
	@echo "Starting frontend container..."
	@docker run -d -p 3000:3000 --env-file .env --name web --network $(NETWORK_NAME) frontend
	@echo "Starting backend container..."
	@docker run -d -p 8080:8080 --env-file .env --name ws --network $(NETWORK_NAME) backend
	@echo "All services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8080"

stop:
	@echo "Stopping containers..."
	@docker stop web ws 2>/dev/null || true
	@docker rm web ws 2>/dev/null || true
	@docker compose down 2>/dev/null || true

clean: stop
	@echo "Removing images..."
	@docker rmi frontend backend 2>/dev/null || true
	@docker network rm $(NETWORK_NAME) 2>/dev/null || true
