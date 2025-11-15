# 🚀 Deploy Platform - Quick Start

## Prerequisites

1. **Docker Desktop** must be running
2. **pnpm** installed (you already have this)

## Deploy in 3 Steps

### Step 1: Start Docker Desktop

Open Docker Desktop application and wait for it to fully start (whale icon should be steady in your menu bar).

### Step 2: Run Deployment Script

From the platform root directory:

```bash
./deploy.sh
```

This automated script will:
- ✅ Check Docker is running
- ✅ Start PostgreSQL and Redis
- ✅ Create all 12 databases
- ✅ Generate environment files for all services
- ✅ Run database migrations
- ✅ Seed initial data (admin user)

**Time**: ~2-3 minutes

### Step 3: Start Services

After deployment completes, start the services:

```bash
# Terminal 1: Start all backend services
pnpm dev

# Terminal 2: Start frontend
cd web/investor-portal
pnpm dev
```

## Access Your Platform

### Main Application
🌐 **Frontend**: http://localhost:3100

**Login Credentials:**
- Email: `admin@platform.com`
- Password: `admin123`

### API Documentation (Swagger UI)

All 12 services have interactive API docs:

- Identity & Auth: http://localhost:3001/api
- Profiles & KYC: http://localhost:3002/api
- Companies: http://localhost:3003/api
- Holdings: http://localhost:3004/api
- Marketplace: http://localhost:3005/api
- Deals: http://localhost:3006/api
- Documents: http://localhost:3007/api
- Payments: http://localhost:3008/api
- Notifications: http://localhost:3009/api
- **Pricing & Valuation**: http://localhost:3010/api
- **Search & Indexing**: http://localhost:3011/api
- **Analytics & Reporting**: http://localhost:3012/api

### Developer Tools

- **Database**: localhost:5432 (user: platform, pass: platform)
- **Redis**: localhost:6379
- **Kafka UI**: http://localhost:8080
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)

## What You Can Do

### 1. Browse the Investor Portal
- View dashboard
- Check profile and KYC status
- See holdings and positions
- Browse marketplace

### 2. Test APIs via Swagger
- All endpoints documented
- Try it out feature
- See request/response schemas

### 3. Create Test Data
- Register new users
- Add companies
- Create holdings
- Make marketplace orders

## Stopping the Platform

```bash
# Stop infrastructure
docker-compose down

# Stop services: Ctrl+C in each terminal
```

## Troubleshooting

### "Docker is not running"
- Open Docker Desktop
- Wait 30 seconds
- Run `docker ps` to verify
- Try `./deploy.sh` again

### Port already in use
- Check what's using the port: `lsof -i :3001`
- Stop conflicting service
- Or change port in docker-compose.yml

### Database connection failed
```bash
# Check PostgreSQL is healthy
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

---

## Ready to Deploy?

1. ✅ Start Docker Desktop
2. ✅ Run: `./deploy.sh`
3. ✅ Run: `pnpm dev`
4. ✅ Visit: http://localhost:3100

**Deployment time: ~3 minutes total**

