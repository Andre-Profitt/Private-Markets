#!/bin/bash

# Create .env files for all services

echo "Creating environment files for all services..."

# Database connection template
DB_USER="platform"
DB_PASS="platform"
DB_HOST="localhost"
DB_PORT="5432"

# Service list
SERVICES=("identity" "profiles" "companies" "holdings" "marketplace" "deals" "documents" "payments" "notifications" "pricing" "search" "analytics")
PORTS=(3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012)

for i in "${!SERVICES[@]}"; do
  SERVICE="${SERVICES[$i]}"
  PORT="${PORTS[$i]}"
  
  ENV_FILE="services/$SERVICE/.env"
  
  echo "Creating $ENV_FILE..."
  
  cat > "$ENV_FILE" << ENVEOF
# $SERVICE Service Environment Variables
NODE_ENV=development
PORT=$PORT

# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$SERVICE?schema=public"

# CORS
CORS_ORIGIN=http://localhost:3100

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=${SERVICE}-service
KAFKA_GROUP_ID=${SERVICE}-group

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (for identity service)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
ENVEOF

done

echo "✅ All environment files created!"
