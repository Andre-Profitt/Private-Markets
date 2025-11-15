#!/bin/bash

echo "🔧 Fixing Prisma client generation for pnpm workspace..."

# List of all services
services=(
  "identity"
  "profiles"
  "companies"
  "holdings"
  "marketplace"
  "deals"
  "documents"
  "payments"
  "notifications"
  "pricing"
  "search"
  "analytics"
)

# Update each service's Prisma schema to use a local output path
for service in "${services[@]}"; do
  echo "📝 Updating $service Prisma schema..."
  schema_file="/Users/test/private-assets-platform/services/$service/prisma/schema.prisma"

  if [ -f "$schema_file" ]; then
    # Check if output is already configured
    if ! grep -q "output" "$schema_file"; then
      # Add output configuration after provider line
      sed -i '' '/provider = "prisma-client-js"/a\
  output   = "../src/generated/prisma-client"' "$schema_file"
      echo "  ✅ Added output path to $service schema"
    else
      echo "  ℹ️  Output already configured for $service"
    fi
  fi
done

echo ""
echo "🔄 Generating Prisma clients with isolated paths..."

for service in "${services[@]}"; do
  echo "📦 Generating Prisma client for $service..."
  cd "/Users/test/private-assets-platform/services/$service"

  # Ensure the generated directory exists
  mkdir -p src/generated

  # Generate Prisma client
  pnpm prisma generate

  if [ $? -eq 0 ]; then
    echo "  ✅ $service Prisma client generated"
  else
    echo "  ❌ Failed to generate Prisma client for $service"
  fi
done

echo ""
echo "📝 Updating database module imports..."

# Update all database modules to import from the generated client
for service in "${services[@]}"; do
  db_module="/Users/test/private-assets-platform/services/$service/src/database/prisma.service.ts"

  if [ -f "$db_module" ]; then
    echo "  Updating $service database module..."
    # Update the import path
    sed -i '' "s|import { PrismaClient } from '@prisma/client'|import { PrismaClient } from '../generated/prisma-client'|" "$db_module"
  fi
done

echo ""
echo "✅ Prisma workspace fix complete!"
echo ""
echo "Next steps:"
echo "1. Restart all services: pkill -f 'nest start' && ./restart-all-services.sh"
echo "2. Check service status: ./check-services.sh"