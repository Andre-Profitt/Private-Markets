# 🚀 Start Platform - Quick Guide

## Step 1: Start Docker Desktop

**IMPORTANT**: Docker Desktop must be running before proceeding.

1. Open **Docker Desktop** application
2. Wait for Docker to fully start (whale icon in menu bar should be steady)
3. Verify Docker is running:
   ```bash
   docker ps
   ```

## Step 2: Start Infrastructure

From the platform root directory:

```bash
# Start all infrastructure services
docker-compose up -d

# Check services are running
docker-compose ps
```

This starts:
- ✅ PostgreSQL (Port 5432) - with all 12 databases
- ✅ Redis (Port 6379)
- ✅ Kafka (Port 9092)
- ✅ MinIO/S3 (Port 9000, 9001)
- ✅ Jaeger (Port 16686)
- ✅ Prometheus (Port 9090)
- ✅ Grafana (Port 3003)
- ✅ Kafka UI (Port 8080)

## Step 3: Run Database Migrations

I'll create a script to run all migrations automatically.

```bash
chmod +x ./scripts/migrate-all.sh
./scripts/migrate-all.sh
```

## Step 4: Seed Initial Data

```bash
chmod +x ./scripts/seed-all.sh
./scripts/seed-all.sh
```

## Step 5: Start All Services

```bash
# Start all backend services in development mode
pnpm dev
```

Or start individually:
```bash
pnpm dev:identity      # Port 3001
pnpm dev:profiles      # Port 3002
pnpm dev:companies     # Port 3003
pnpm dev:holdings      # Port 3004
pnpm dev:marketplace   # Port 3005
pnpm dev:deals         # Port 3006
pnpm dev:documents     # Port 3007
pnpm dev:payments      # Port 3008
pnpm dev:notifications # Port 3009
pnpm dev:pricing       # Port 3010
pnpm dev:search        # Port 3011
pnpm dev:analytics     # Port 3012
```

## Step 6: Start Frontend

```bash
pnpm dev:web  # Port 3100
```

## Access the Platform

### Main Application
- **Investor Portal**: http://localhost:3100
- **Default Login**: admin@platform.com / admin123

### API Documentation (Swagger)
- Identity: http://localhost:3001/api
- Profiles: http://localhost:3002/api
- Companies: http://localhost:3003/api
- Holdings: http://localhost:3004/api
- Marketplace: http://localhost:3005/api
- Deals: http://localhost:3006/api
- Documents: http://localhost:3007/api
- Payments: http://localhost:3008/api
- Notifications: http://localhost:3009/api
- **Pricing**: http://localhost:3010/api
- **Search**: http://localhost:3011/api
- **Analytics**: http://localhost:3012/api

### Monitoring & Tools
- Kafka UI: http://localhost:8080
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
- Jaeger Tracing: http://localhost:16686
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3003 (admin/admin)

## Quick Stop

```bash
# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Troubleshooting

### Docker not running
```bash
# macOS: Start Docker Desktop from Applications
open -a Docker

# Wait 30 seconds, then verify
docker ps
```

### Port conflicts
If ports are in use, modify docker-compose.yml or stop conflicting services.

### Database connection errors
Ensure PostgreSQL container is healthy:
```bash
docker-compose ps postgres
docker-compose logs postgres
```

---

**Ready to start? Follow Step 1 above!**
