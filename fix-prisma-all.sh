#!/bin/bash

echo "🔧 Fixing Prisma client generation for all services..."

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

# Fix Prisma schemas - remove custom output paths
for service in "${services[@]}"; do
  echo "📝 Checking $service service..."
  schema_file="/Users/test/private-assets-platform/services/$service/prisma/schema.prisma"

  if [ -f "$schema_file" ]; then
    # Check if it has a custom output configuration
    if grep -q "output.*=" "$schema_file"; then
      echo "  Removing custom output from $service schema..."
      # Remove the output line
      sed -i '' '/output.*=/d' "$schema_file"
    fi
  fi
done

echo "✅ All schemas updated"

# Generate Prisma clients for all services
echo ""
echo "🔄 Generating Prisma clients..."

for service in "${services[@]}"; do
  echo ""
  echo "📦 Generating Prisma client for $service..."
  cd "/Users/test/private-assets-platform/services/$service"

  # Generate Prisma client
  pnpm prisma generate

  if [ $? -eq 0 ]; then
    echo "  ✅ $service Prisma client generated successfully"
  else
    echo "  ❌ Failed to generate Prisma client for $service"
  fi
done

echo ""
echo "🎉 Prisma client generation complete!"