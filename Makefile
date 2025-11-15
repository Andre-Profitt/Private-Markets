.PHONY: help install dev build test clean docker-up docker-down

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start all services in development mode
	pnpm dev

build: ## Build all services
	pnpm build

test: ## Run all tests
	pnpm test

lint: ## Run linter
	pnpm lint

format: ## Format code
	pnpm format

clean: ## Clean build artifacts and dependencies
	pnpm clean

docker-up: ## Start Docker infrastructure
	docker-compose up -d

docker-down: ## Stop Docker infrastructure
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

db-migrate: ## Run database migrations
	pnpm db:migrate

db-studio: ## Open Prisma Studio
	pnpm db:studio
