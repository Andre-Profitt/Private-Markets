# Holdings & Positions Service

Manages individual investor holdings, transactions, and portfolio tracking.

## Features

- ✅ Individual holdings tracking
- ✅ Transaction history
- ✅ Position aggregation by security
- ✅ Portfolio snapshots
- ✅ Transfer requests and approvals
- ✅ Cost basis tracking
- ✅ Restriction period management

## API Endpoints

### Holdings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/holdings` | Create new holding |
| GET | `/holdings/user/:userId` | Get all holdings for user |
| GET | `/holdings/:id` | Get holding by ID |
| PUT | `/holdings/:id` | Update holding |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transactions` | Create transaction |
| GET | `/transactions/user/:userId` | Get user transactions |
| GET | `/transactions/holding/:holdingId` | Get holding transactions |
| PUT | `/transactions/:id/status` | Update transaction status |

### Positions (Aggregated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/positions/user/:userId` | Get aggregated positions |
| GET | `/positions/user/:userId/summary` | Get position summary |

### Portfolio

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/portfolio/user/:userId/snapshot` | Create portfolio snapshot |
| GET | `/portfolio/user/:userId/history` | Get portfolio history |

### Transfers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transfers/request` | Request share transfer |
| PUT | `/transfers/:id/approve` | Approve transfer (admin) |

## Acquisition Methods

- `PURCHASE` - Purchased shares
- `GRANT` - Granted shares (e.g., employee grants)
- `EXERCISE` - Exercised options
- `TRANSFER` - Transferred from another holder
- `CONVERSION` - Converted from another security
- `DIVIDEND` - Dividend shares
- `OTHER` - Other acquisition method

## Transaction Types

- `BUY` - Purchase transaction
- `SELL` - Sale transaction
- `TRANSFER_IN` - Incoming transfer
- `TRANSFER_OUT` - Outgoing transfer
- `GRANT` - Share grant
- `EXERCISE` - Option exercise
- `CONVERSION` - Security conversion
- `SPLIT` - Stock split
- `DIVIDEND` - Dividend payment
- `CANCELLATION` - Share cancellation

## Setup

```bash
cd services/holdings
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Service runs on http://localhost:3004

## Usage Examples

### Create Holding

```bash
curl -X POST http://localhost:3004/holdings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "companyId": "company-uuid",
    "securityClassId": "security-class-uuid",
    "sharesOwned": 1000,
    "costBasis": 10.50,
    "totalCost": 10500,
    "acquisitionDate": "2024-01-15",
    "acquisitionMethod": "PURCHASE",
    "isRestricted": true,
    "restrictionEndDate": "2025-01-15",
    "notes": "Purchased in Series B round"
  }'
```

### Create Transaction

```bash
curl -X POST http://localhost:3004/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "holdingId": "holding-uuid",
    "companyId": "company-uuid",
    "securityClassId": "security-class-uuid",
    "transactionType": "BUY",
    "transactionDate": "2024-03-15",
    "settlementDate": "2024-03-17",
    "shares": 500,
    "pricePerShare": 12.50,
    "totalAmount": 6250,
    "fees": 25,
    "notes": "Additional purchase"
  }'
```

### Get User Positions

```bash
curl http://localhost:3004/positions/user/{userId}
```

Returns aggregated positions grouped by company and security class with:
- Total shares owned
- Average cost basis
- Total cost
- Individual holdings breakdown

### Get Position Summary

```bash
curl http://localhost:3004/positions/user/{userId}/summary
```

Returns high-level summary:
- Total number of positions
- Total companies invested in
- Total shares owned
- Total amount invested

### Create Portfolio Snapshot

```bash
curl -X POST http://localhost:3004/portfolio/user/{userId}/snapshot
```

Creates a point-in-time snapshot of the user's entire portfolio for historical tracking.

### Request Transfer

```bash
curl -X POST http://localhost:3004/transfers/request \
  -H "Content-Type: application/json" \
  -d '{
    "fromUserId": "seller-uuid",
    "toUserId": "buyer-uuid",
    "holdingId": "holding-uuid",
    "shares": 500,
    "reason": "Secondary market sale"
  }'
```

### Approve Transfer (Admin)

```bash
curl -X PUT http://localhost:3004/transfers/{transferId}/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approvedBy": "admin-user-uuid"
  }'
```

## Database Schema

### Holding
- User and security references
- Shares owned and cost basis
- Acquisition details
- Restriction information
- Status tracking

### Transaction
- Complete transaction history
- Buy, sell, transfer, grant, etc.
- Settlement tracking
- Counterparty information
- Fee tracking

### Position (Aggregated View)
- Automatically calculated from holdings
- Groups by user, company, and security
- Average cost and total cost
- Current valuation (when available)
- Unrealized gain/loss

### PortfolioSnapshot
- Point-in-time portfolio value
- Historical tracking
- Realized and unrealized gains
- Holdings summary

### TransferRequest
- Share transfer workflow
- Approval process
- Status tracking
- Audit trail

## Key Features

### Position Aggregation
- Automatically aggregates multiple holdings into positions
- Calculates average cost basis
- Tracks first acquisition date
- Groups by company and security class

### Cost Basis Tracking
- Individual holding cost basis
- Aggregated average cost
- Total investment tracking
- Ready for tax reporting

### Transfer Workflow
- Self-service transfer requests
- Admin approval required
- Automatic transaction creation
- Restriction period validation

### Portfolio Analytics
- Snapshot creation for historical tracking
- Position summaries
- Transaction history
- Ready for performance reporting

### Audit Logging
- All create, update, approve operations logged
- User attribution
- Full audit trail
- Compliance ready

## Notes

- Holdings can be restricted with end dates
- Transfers require approval for compliance
- Positions are calculated in real-time from holdings
- Portfolio snapshots preserve historical values
- All monetary values use high-precision decimals
