# Identity & Auth Service

User authentication, authorization, and role-based access control.

## Features

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Refresh token rotation
- ✅ Password hashing with bcrypt
- ✅ Audit logging
- ✅ Session management
- ✅ Multi-tenant ready

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |

### Users

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/users` | List all users | ADMIN, COMPLIANCE |
| GET | `/users/:id` | Get user by ID | ADMIN, COMPLIANCE |
| PUT | `/users/:id` | Update user | ADMIN |
| DELETE | `/users/:id` | Delete user | ADMIN |
| GET | `/users/:id/roles` | Get user roles | ADMIN, COMPLIANCE |

### Roles

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/roles` | List all roles | Authenticated |
| GET | `/roles/:id` | Get role by ID | Authenticated |
| POST | `/roles/seed` | Seed default roles | ADMIN |

## Setup

### 1. Set Environment Variables

```bash
DATABASE_URL=postgresql://platform:platform@localhost:5432/platform_dev
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
IDENTITY_SERVICE_PORT=3001
```

### 2. Install Dependencies

```bash
cd services/identity
pnpm install
```

### 3. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 4. Run Migrations

```bash
pnpm prisma:migrate
```

### 5. Seed Database

```bash
pnpm prisma:seed
```

This creates:
- Default roles (ADMIN, INVESTOR, SELLER, COMPLIANCE, OPS)
- Admin user: `admin@platform.com` / `admin123`

### 6. Start the Service

```bash
pnpm dev
```

Service runs on http://localhost:3001

## Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "investor@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "investor@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["INVESTOR"]
  }
}
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@platform.com",
    "password": "admin123"
  }'
```

### Get Current User

```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### Refresh Token

```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refresh_token>"
  }'
```

## Database Schema

### User
- id, email, passwordHash
- firstName, lastName
- status, emailVerified, mfaEnabled
- tenantId (multi-tenant support)
- Timestamps: createdAt, updatedAt, lastLoginAt

### Role
- id, name, description
- permissions (JSON)

### UserRole
- User-to-Role many-to-many relationship

### Session
- Active user sessions
- IP address and user agent tracking

### RefreshToken
- Refresh token management
- Token rotation on refresh

### AuditLog
- Complete audit trail
- User actions, resources, metadata

## Default Roles

- **ADMIN**: System administrator with full access
- **INVESTOR**: Accredited investor
- **SELLER**: Shareholder selling positions
- **COMPLIANCE**: Compliance officer
- **OPS**: Operations team member

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with configurable expiry
- Refresh token rotation
- Audit logging for all auth events
- Role-based access control
- Multi-tenant capable

## OpenAPI Documentation

Visit http://localhost:3001/api for interactive API documentation.

## Development

```bash
# Run in watch mode
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# View database
pnpm prisma:studio
```

## Architecture

```
src/
├── auth/                    # Authentication logic
│   ├── dto/                # Data transfer objects
│   ├── guards/             # Auth guards
│   ├── strategies/         # Passport strategies
│   ├── decorators/         # Custom decorators
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                   # User management
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── roles/                   # Role management
│   ├── roles.controller.ts
│   ├── roles.service.ts
│   └── roles.module.ts
├── database/                # Database module
│   ├── prisma.service.ts
│   └── database.module.ts
├── app.module.ts
└── main.ts
```
