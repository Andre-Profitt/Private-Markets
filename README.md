# Private Assets Platform

Enterprise-grade marketplace for private company securities with direct indexing capabilities.

## Overview

This platform enables:
- **Core Marketplace**: Secondary trading of private company shares between accredited investors
- **Direct Indexing**: Portfolio construction and rebalancing across indices of private companies
- **Compliance**: Built-in KYC/AML, audit trails, and regulatory compliance

## Architecture

### Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | BFF, auth, rate limiting, routing |
| Identity | 3001 | Authentication, authorization, RBAC |
| Profiles | 3002 | User profiles, KYC, accreditation |
| Companies | 3003 | Company & security master data |
| Holdings | 3004 | User positions and ownership verification |
| Marketplace | 3005 | Listings, orders, trade matching |
| Deals | 3006 | Deal lifecycle and workflow orchestration |
| Documents | 3007 | Document management and e-signature |
| Payments | 3008 | Payment processing and settlement |
| Pricing | 3009 | Trade data and price history |
| Indexing | 3010 | Index definitions and direct indexing |
| Notifications | 3011 | Email, SMS, and in-app notifications |
| Admin | 3012 | Admin console, audit logs, compliance |

### Tech Stack

- **Backend**: TypeScript, NestJS, Prisma
- **Database**: PostgreSQL
- **Message Bus**: Apache Kafka
- **Cache**: Redis
- **Frontend**: React, Next.js, TanStack Query
- **Infrastructure**: Docker, Kubernetes, Terraform
- **Observability**: OpenTelemetry, Prometheus, Grafana

## Project Structure

```
private-assets-platform/
├── services/              # Backend microservices
│   ├── identity/         # Auth & identity management
│   ├── profiles/         # KYC & user profiles
│   ├── companies/        # Company master data
│   ├── holdings/         # Position tracking
│   ├── marketplace/      # Trading engine
│   ├── deals/           # Deal workflows
│   ├── documents/       # Document & e-sign
│   ├── payments/        # Payment processing
│   ├── pricing/         # Price data
│   ├── indexing/        # Direct indexing
│   ├── notifications/   # Communications
│   └── admin/           # Admin & compliance
├── web/                  # Frontend applications
│   ├── app/             # Main investor/seller portal
│   └── admin/           # Admin console
├── packages/             # Shared libraries
│   ├── common/          # Shared utilities
│   ├── types/           # Shared TypeScript types
│   ├── config/          # Configuration management
│   ├── logger/          # Logging utilities
│   ├── database/        # Database utilities
│   └── events/          # Event schemas
├── infrastructure/       # IaC and deployment
│   ├── terraform/       # Terraform configs
│   ├── kubernetes/      # K8s manifests
│   └── docker/          # Dockerfiles
├── docs/                # Documentation
└── scripts/             # Build and deployment scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm 8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd private-assets-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Start infrastructure services:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
pnpm migrate:dev
```

6. Start all services:
```bash
pnpm dev
```

### Development

Start individual services:
```bash
pnpm dev:identity
pnpm dev:marketplace
pnpm dev:web
```

Run tests:
```bash
pnpm test              # All tests
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests
pnpm test:e2e          # End-to-end tests
```

Linting and formatting:
```bash
pnpm lint
pnpm format
```

## Security

- All PII encrypted at rest and in transit
- RBAC with tenant isolation
- Comprehensive audit logging
- Regular security scanning and pen testing

## Compliance

- SOC 2 Type II controls
- Immutable audit trails
- Data retention policies
- KYC/AML integration

## License

Proprietary - All Rights Reserved
