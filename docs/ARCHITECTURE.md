# Architecture Overview

## System Architecture

The Private Assets Platform is built as a distributed system with clear service boundaries.

### Service Architecture

```
┌─────────────┐
│   Clients   │
│ (Web/Mobile)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Gateway │
│   (BFF)     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Microservices Layer             │
│                                         │
│  ┌──────┐  ┌─────┐  ┌──────┐  ┌─────┐ │
│  │Identity│ │Users│  │Companies│ │Deals│ │
│  └───┬──┘  └──┬──┘  └───┬──┘  └──┬──┘ │
│      │        │         │        │     │
│  ┌───┴────────┴─────────┴────────┴──┐  │
│  │     Message Bus (Kafka)          │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│          Data Layer                     │
│                                         │
│  ┌──────────┐  ┌──────┐  ┌──────────┐  │
│  │PostgreSQL│  │ Redis│  │   S3     │  │
│  └──────────┘  └──────┘  └──────────┘  │
└─────────────────────────────────────────┘
```

## Service Responsibilities

### Identity & Auth Service
- User authentication (JWT)
- Role-based access control
- MFA support
- Session management

### Profiles Service
- User profiles
- KYC/KYB integration
- Accreditation verification

### Companies Service
- Company master data
- Security definitions
- Cap table references

### Holdings Service
- User position tracking
- Ownership verification

### Marketplace Service
- Listings management
- Order placement
- Trade matching

### Deals Service
- Deal lifecycle management
- Workflow orchestration
- State machine

### Documents Service
- Document templates
- E-signature integration
- Document storage

### Payments Service
- Payment processing
- Settlement tracking
- Escrow integration

### Pricing Service
- Price history
- Trade data aggregation
- Valuation metrics

### Indexing Service (Phase 2)
- Index definitions
- Portfolio construction
- Rebalancing engine

### Notifications Service
- Email/SMS notifications
- In-app notifications
- Event-driven messaging

### Admin Service
- Audit logs
- Compliance tools
- System administration

## Data Flow

### Order Placement Flow

1. User creates order via Web App
2. API Gateway authenticates request
3. Marketplace Service validates order
4. Order saved to database
5. OrderCreated event published to Kafka
6. Notifications Service sends confirmation
7. Pricing Service updates market data

### Deal Execution Flow

1. Deal created in Deals Service
2. Participants added
3. Documents generated via Documents Service
4. E-signatures collected
5. Payment initiated via Payments Service
6. Settlement confirmed
7. Holdings updated in Holdings Service

## Technology Stack

- **Backend**: TypeScript, NestJS
- **Database**: PostgreSQL (with schemas per service)
- **Cache**: Redis
- **Message Bus**: Apache Kafka
- **Storage**: S3 (MinIO for local dev)
- **Frontend**: React, Next.js
- **Infrastructure**: Kubernetes, Terraform
- **Observability**: OpenTelemetry, Jaeger, Prometheus, Grafana
