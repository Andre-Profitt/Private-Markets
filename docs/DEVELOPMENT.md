# Development Guide

## Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL client tools

## Initial Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd private-assets-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Start infrastructure:
```bash
pnpm docker:up
```

5. Run database migrations:
```bash
pnpm db:migrate
```

## Development Workflow

### Running Services

Start all services:
```bash
pnpm dev
```

Start individual services:
```bash
pnpm dev:identity
pnpm dev:marketplace
pnpm dev:web
```

### Running Tests

```bash
# All tests
pnpm test

# Specific service
pnpm --filter @platform/identity-service test

# Watch mode
pnpm --filter @platform/identity-service test:watch

# Coverage
pnpm test:cov
```

### Code Quality

```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check
```

### Database

```bash
# Create migration
cd services/identity
pnpm prisma migrate dev --name init

# Generate Prisma client
pnpm db:generate

# Open Prisma Studio
pnpm db:studio
```

## Project Structure

```
private-assets-platform/
├── services/           # Backend microservices
├── web/               # Frontend applications
├── packages/          # Shared libraries
├── infrastructure/    # IaC and deployment
├── docs/             # Documentation
└── scripts/          # Build scripts
```

## Adding a New Service

1. Create service directory:
```bash
mkdir -p services/new-service/src
```

2. Copy package.json from existing service

3. Create main.ts and app.module.ts

4. Add to workspace and root scripts

5. Create Prisma schema if needed

6. Add service to docker-compose.yml

## Debugging

### VS Code

Use the provided launch configurations in `.vscode/launch.json`.

### Chrome DevTools

Services run with `--inspect` flag in development mode.

## Common Issues

### Port already in use
```bash
# Kill process on port
lsof -ti:3001 | xargs kill -9
```

### Database connection issues
```bash
# Restart PostgreSQL container
docker-compose restart postgres
```

### Stale dependencies
```bash
# Clean install
pnpm clean
pnpm install
```
