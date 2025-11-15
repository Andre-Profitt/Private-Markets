# User Profiles, KYC & Accreditation Service

Manages user profiles, KYC/KYB verification, and accreditation status for investors.

## Features

- ✅ User profile management
- ✅ KYC/KYB verification with mock provider
- ✅ Accreditation verification (income, net worth, credentials)
- ✅ Document management
- ✅ Profile completion tracking
- ✅ Automated sanctions & PEP screening

## API Endpoints

### Profiles

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profiles` | Create user profile |
| GET | `/profiles/user/:userId` | Get profile by user ID |
| PUT | `/profiles/user/:userId` | Update profile |
| GET | `/profiles/user/:userId/completion` | Get completion status |

### KYC

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/kyc/user/:userId/start` | Initiate KYC check |
| GET | `/kyc/user/:userId` | Get all KYC checks |
| GET | `/kyc/user/:userId/status` | Get overall KYC status |
| GET | `/kyc/:id` | Get specific check |
| PUT | `/kyc/:id` | Update check (admin) |

### Accreditation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/accreditation/user/:userId/verify` | Verify accreditation |
| GET | `/accreditation/user/:userId` | Get status |
| PUT | `/accreditation/user/:userId/revoke` | Revoke status |
| POST | `/accreditation/user/:userId/renew` | Request renewal |

## KYC Check Types

- `IDENTITY_VERIFICATION` - Document + face verification
- `ADDRESS_VERIFICATION` - Proof of address
- `SANCTIONS_SCREENING` - Check against sanctions lists
- `PEP_SCREENING` - Politically Exposed Person check
- `ADVERSE_MEDIA_SCREENING` - Negative news screening

## Accreditation Types

1. **INCOME_TEST**: $200k individual / $300k joint annual income
2. **NET_WORTH_TEST**: $1M net worth (excluding primary residence)
3. **PROFESSIONAL_CREDENTIAL**: Series 7, 65, or 82 licenses
4. **QUALIFIED_PURCHASER**: $5M+ in investments

## Setup

```bash
cd services/profiles
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Service runs on http://localhost:3002

## Usage Examples

### Create Profile

```bash
curl -X POST http://localhost:3002/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+1-555-0123",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  }'
```

### Initiate KYC Check

```bash
curl -X POST http://localhost:3002/kyc/user/{userId}/start \
  -H "Content-Type: application/json" \
  -d '{
    "checkType": "IDENTITY_VERIFICATION",
    "provider": "MOCK"
  }'
```

### Verify Accreditation (Income Test)

```bash
curl -X POST http://localhost:3002/accreditation/user/{userId}/verify \
  -H "Content-Type: application/json" \
  -d '{
    "verificationType": "INCOME_TEST",
    "annualIncome": 250000
  }'
```

## Mock KYC Provider

The mock provider simulates real KYC checks with:
- 80% approval rate for identity verification
- Realistic delays (600-1000ms)
- Risk scoring
- Detailed check results

In production, replace with real providers:
- Onfido
- Jumio
- Persona
- Veriff

## Database Schema

### UserProfile
- Personal information
- Address details
- Profile completion tracking

### KycCheck
- Check type, status, results
- Risk scoring
- Provider integration

### AccreditationStatus
- Verification type and status
- Financial thresholds
- Expiration tracking

### ProfileDocument
- Uploaded documents
- Verification status
- S3 storage references
