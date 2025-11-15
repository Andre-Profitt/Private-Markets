# Company & Security Master Service

Manages company master data, security definitions, and capitalization table.

## Features

- ✅ Company profile management
- ✅ Security class definitions (Common Stock, Preferred Stock, etc.)
- ✅ Security instrument tracking
- ✅ Valuation history
- ✅ Corporate actions tracking
- ✅ Cap table generation
- ✅ Comprehensive company analytics

## API Endpoints

### Companies

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/companies` | Create new company |
| GET | `/companies` | List all companies (paginated) |
| GET | `/companies/:id` | Get company by ID |
| PUT | `/companies/:id` | Update company |
| DELETE | `/companies/:id` | Delete company |
| GET | `/companies/:id/cap-table` | Get capitalization table |
| GET | `/companies/:id/stats` | Get company statistics |

### Security Classes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/security-classes` | Create security class |
| GET | `/security-classes/company/:companyId` | Get all classes for company |
| GET | `/security-classes/:id` | Get security class by ID |
| PUT | `/security-classes/:id` | Update security class |

### Valuations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/valuations` | Create valuation |
| GET | `/valuations/company/:companyId` | Get valuation history |
| GET | `/valuations/company/:companyId/latest` | Get latest valuation |

## Business Types

- `C_CORP` - C Corporation
- `S_CORP` - S Corporation
- `LLC` - Limited Liability Company
- `PARTNERSHIP` - Partnership
- `SOLE_PROPRIETORSHIP` - Sole Proprietorship
- `NON_PROFIT` - Non-Profit Organization
- `OTHER` - Other

## Security Class Types

- `COMMON_STOCK` - Common Stock
- `PREFERRED_STOCK` - Preferred Stock
- `CONVERTIBLE_NOTE` - Convertible Note
- `SAFE` - Simple Agreement for Future Equity
- `WARRANT` - Warrant
- `OPTION` - Stock Option
- `UNITS` - Units (combination of securities)
- `OTHER` - Other

## Valuation Types

- `FUNDRAISE` - Equity fundraising round
- `VALUATION_409A` - 409A valuation
- `SECONDARY_SALE` - Secondary market sale
- `ACQUISITION_OFFER` - Acquisition offer
- `MARKET_ESTIMATE` - Market estimate
- `INTERNAL` - Internal valuation
- `OTHER` - Other

## Setup

```bash
cd services/companies
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Service runs on http://localhost:3003

## Usage Examples

### Create Company

```bash
curl -X POST http://localhost:3003/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Technologies",
    "legalName": "Acme Technologies Inc.",
    "ein": "12-3456789",
    "incorporationDate": "2020-01-15",
    "jurisdiction": "Delaware",
    "businessType": "C_CORP",
    "industry": "Technology",
    "sector": "Software & Services",
    "description": "Leading provider of cloud-based SaaS solutions",
    "website": "https://acme.com",
    "street": "123 Innovation Drive",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "US"
  }'
```

### Create Security Class (Preferred Stock)

```bash
curl -X POST http://localhost:3003/security-classes \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "company-uuid",
    "name": "Series A Preferred Stock",
    "classType": "PREFERRED_STOCK",
    "parValue": 0.0001,
    "authorizedShares": 10000000,
    "liquidationPreference": 1.0,
    "dividendRate": 0.08,
    "conversionRatio": 1.0,
    "votingRights": true,
    "participatingRights": false,
    "issuanceDate": "2022-06-15",
    "description": "Series A Preferred Stock with 1x liquidation preference"
  }'
```

### Create Valuation

```bash
curl -X POST http://localhost:3003/valuations \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "company-uuid",
    "valuationDate": "2024-03-15",
    "pricePerShare": 12.50,
    "totalValuation": 125000000,
    "valuationType": "FUNDRAISE",
    "source": "Series B Fundraise - $25M at $125M post-money",
    "notes": "Led by Acme Ventures with participation from existing investors"
  }'
```

### Get Cap Table

```bash
curl http://localhost:3003/companies/{companyId}/cap-table
```

Returns detailed capitalization table with:
- All security classes
- Shareholders and their holdings
- Share utilization percentages
- Active instruments

### Get Company Stats

```bash
curl http://localhost:3003/companies/{companyId}/stats
```

Returns:
- Total security classes
- Total active instruments
- Latest valuation
- Corporate actions in last 12 months

## Database Schema

### Company
- Basic company information (name, EIN, incorporation details)
- Business type and industry classification
- Address and contact information
- Company status

### SecurityClass
- Security type (Common, Preferred, SAFE, etc.)
- Authorization and issuance details
- Preferred stock terms (liquidation preference, dividends, conversion)
- Voting and participation rights

### SecurityInstrument
- Individual share certificates
- Holder information
- Purchase details and restrictions
- Instrument status

### CompanyValuation
- Historical valuations
- Price per share and total valuation
- Valuation type and source
- Notes and metadata

### CorporateAction
- Stock splits and reverse splits
- Dividends
- M&A activities
- Other corporate events

## Key Features

### Capitalization Table
- Real-time cap table generation
- Grouped by security class
- Shareholder-level detail
- Utilization tracking

### Audit Logging
- All create, update, delete operations logged
- User attribution
- Change tracking
- Full audit trail

### Data Validation
- Duplicate EIN prevention
- Security class uniqueness per company
- Active instrument checks before deletion
- Comprehensive input validation

## Notes

- Companies cannot be deleted if they have active security instruments
- Security class names must be unique within a company
- All monetary values use high-precision decimals
- Audit logs are automatically created for all mutations
