# API Documentation

## Authentication

All API requests require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Base URLs

- Development: `http://localhost:3000`
- Staging: `https://api-staging.platform.com`
- Production: `https://api.platform.com`

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Service Endpoints

Each service exposes OpenAPI documentation at `/api`:

- Identity: http://localhost:3001/api
- Profiles: http://localhost:3002/api
- Companies: http://localhost:3003/api
- Marketplace: http://localhost:3005/api

## Example Requests

### Authentication

#### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

#### Get Current User
```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer <token>"
```

### Marketplace

#### Create Listing
```bash
curl -X POST http://localhost:3005/listings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "uuid",
    "type": "SELL",
    "minSize": 1000,
    "priceGuidance": 50.00
  }'
```

#### Get Listings
```bash
curl http://localhost:3005/listings?companyId=<uuid> \
  -H "Authorization: Bearer <token>"
```
