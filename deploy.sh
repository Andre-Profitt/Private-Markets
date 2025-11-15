#!/bin/bash

set -e

echo "🚀 Platform Deployment Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "1️⃣  Checking Docker..."
if ! docker ps >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo ""
    echo "Please start Docker Desktop and run this script again."
    echo ""
    echo "macOS: Open Docker from Applications folder"
    echo "Then wait 30 seconds for Docker to fully start."
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Start infrastructure
echo "2️⃣  Starting infrastructure services..."
docker-compose up -d postgres redis
echo -e "${GREEN}✅ Infrastructure started${NC}"
echo ""

# Wait for PostgreSQL
echo "3️⃣  Waiting for PostgreSQL to be ready..."
sleep 5
until docker exec platform-postgres pg_isready -U platform >/dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done
echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
echo ""

# Create environment files
echo "4️⃣  Creating environment files..."
./scripts/create-env-files.sh
echo -e "${GREEN}✅ Environment files created${NC}"
echo ""

# Run migrations
echo "5️⃣  Running database migrations..."
./scripts/migrate-all.sh
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Seed data
echo "6️⃣  Seeding initial data..."
./scripts/seed-all.sh
echo -e "${GREEN}✅ Data seeded${NC}"
echo ""

echo "═══════════════════════════════════════════"
echo -e "${GREEN}🎉 Platform deployed successfully!${NC}"
echo "═══════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Start backend services:"
echo -e "   ${YELLOW}pnpm dev${NC}"
echo ""
echo "2. In a new terminal, start frontend:"
echo -e "   ${YELLOW}cd web/investor-portal && pnpm dev${NC}"
echo ""
echo "3. Access the platform:"
echo -e "   ${GREEN}Frontend:${NC} http://localhost:3100"
echo -e "   ${GREEN}Login:${NC} admin@platform.com / admin123"
echo ""
echo "4. View API docs at http://localhost:3001/api (and 3002-3012)"
echo ""
echo "To stop infrastructure:"
echo -e "   ${YELLOW}docker-compose down${NC}"
echo ""
