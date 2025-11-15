# Marketplace Service

Secondary marketplace for trading private securities between investors.

## Features

- Order creation (Market, Limit, Stop-Limit)
- Automatic order matching engine
- Order book management
- Trade execution and settlement
- Fee calculation (1% buyer + seller)
- Real-time market data

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order |
| GET | `/orders/user/:userId` | Get user orders |
| GET | `/orders/book/:companyId/:securityClassId` | Get order book |
| PUT | `/orders/:id/cancel` | Cancel order |

## Setup

```bash
cd services/marketplace
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Service runs on http://localhost:3005
