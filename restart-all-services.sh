#!/bin/bash

echo "🔄 Regenerating all Prisma clients and restarting services..."

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

# Kill all existing service processes
echo "⏹️  Stopping all running services..."
pkill -f "nest start --watch" 2>/dev/null || true
sleep 2

# Regenerate Prisma clients for all services
echo "🔧 Regenerating Prisma clients..."
for service in "${services[@]}"; do
  echo "  📦 Generating Prisma client for $service..."
  cd "/Users/test/private-assets-platform/services/$service"
  pnpm prisma generate
  if [ $? -eq 0 ]; then
    echo "    ✅ $service Prisma client generated"
  else
    echo "    ❌ Failed to generate Prisma client for $service"
  fi
done

echo ""
echo "🚀 Starting all services..."

# Start each service in background
for service in "${services[@]}"; do
  echo "  Starting $service service..."
  cd "/Users/test/private-assets-platform/services/$service"
  nohup pnpm dev > "/tmp/${service}.log" 2>&1 &
  echo "    Started $service (PID: $!)"
done

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
echo ""

# Define port mappings
declare -A ports
ports["identity"]=3001
ports["profiles"]=3002
ports["companies"]=3003
ports["holdings"]=3004
ports["marketplace"]=3005
ports["deals"]=3006
ports["documents"]=3007
ports["payments"]=3008
ports["notifications"]=3009
ports["pricing"]=3010
ports["search"]=3011
ports["analytics"]=3012

# Check each service
for service in "${services[@]}"; do
  port=${ports[$service]}
  if curl -s "http://localhost:$port/api" > /dev/null 2>&1; then
    echo "  ✅ $service service is running on port $port"
  else
    echo "  ❌ $service service is not responding on port $port"
    echo "     Check logs: tail -f /tmp/${service}.log"
  fi
done

echo ""
echo "🎉 Service restart complete!"
echo ""
echo "View logs with: tail -f /tmp/{service-name}.log"
echo "Example: tail -f /tmp/identity.log"