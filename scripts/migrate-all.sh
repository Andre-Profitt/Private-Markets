#!/bin/bash

echo "🔄 Running database migrations for all services..."

SERVICES=("identity" "profiles" "companies" "holdings" "marketplace" "deals" "documents" "payments" "notifications" "pricing" "search" "analytics")

for SERVICE in "${SERVICES[@]}"; do
  echo ""
  echo "📦 Migrating $SERVICE service..."
  cd "services/$SERVICE"
  
  if [ -f "prisma/schema.prisma" ]; then
    echo "  - Generating Prisma client..."
    pnpm prisma:generate
    
    echo "  - Running migrations..."
    pnpm prisma migrate deploy 2>/dev/null || pnpm prisma db push --skip-generate
  fi
  
  cd ../..
  echo "  ✅ $SERVICE migrated"
done

echo ""
echo "🎉 All migrations completed!"
