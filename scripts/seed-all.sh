#!/bin/bash

echo "🌱 Seeding initial data..."

# Seed identity service (creates admin user and roles)
echo "📦 Seeding identity service..."
cd services/identity
if [ -f "prisma/seed/seed.ts" ]; then
  pnpm prisma db seed 2>/dev/null || echo "  ⚠️  Seed script not configured, skipping..."
fi
cd ../..

echo ""
echo "🎉 Seeding completed!"
echo ""
echo "Default credentials:"
echo "  Email: admin@platform.com"
echo "  Password: admin123"
