# Week 1: Build the Core MVP

## What We're Actually Building This Week

### Monday-Tuesday: Auth + Basic Flows

#### 1. Update User Model for Roles
```prisma
// services/identity/prisma/schema.prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  passwordHash    String
  userType        UserType // NEW: SELLER, BUYER, ADMIN

  // Basic profile fields
  firstName       String
  lastName        String
  phone           String?
  country         String?

  // Seller-specific
  company         String?  // "I work(ed) at..."

  // Buyer-specific
  investorType    InvestorType? // INDIVIDUAL, FAMILY_OFFICE, FUND

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum UserType {
  SELLER
  BUYER
  ADMIN
}

enum InvestorType {
  INDIVIDUAL
  FAMILY_OFFICE
  FUND
}
```

#### 2. Frontend Pages to Build

**`/signup` - Role-based registration**
```jsx
// Simple radio buttons:
"I want to..."
○ Sell my shares (employee/early investor)
○ Buy shares (accredited investor)

// Then conditional fields based on selection
```

**`/seller/onboarding` - Seller flow**
```jsx
Step 1: Basic Info
- First name, Last name
- Email (pre-filled)
- Phone
- Country
- Company (dropdown or text input)

Step 2: Holdings
- Share type: [Common / Preferred / Options]
- Number of shares owned: [    ]
- Grant date: [    ]
- Upload proof: [Choose file]
  (option agreement, cap table screenshot, etc.)

Step 3: Consent
□ I legally own these shares
□ I understand this is not tax or legal advice
□ I agree to program terms
[Complete Registration]
```

**`/buyer/onboarding` - Buyer flow**
```jsx
Step 1: Investor Profile
- Investor type: [Individual / Family Office / Fund]
- Investment range: [<$100k / $100k-$1M / >$1M]

Step 2: Accreditation
"I am accredited because..." (check all that apply)
□ Income >$200k (or $300k joint) for 2 years
□ Net worth >$1M excluding primary residence
□ Registered investment advisor
□ Other: [    ]

Upload supporting doc (optional for now):
[Choose file]

Step 3: Terms
□ I understand these are illiquid securities
□ I may lose my entire investment
□ I am not relying on this platform for advice
[Complete Registration]
```

### Wednesday-Thursday: Holdings & Deal Models

#### 3. Core Database Models

```prisma
// services/holdings/prisma/schema.prisma
model Holding {
  id            String   @id @default(uuid())
  userId        String
  companyId     String

  shareType     ShareType
  quantity      Int
  grantDate     DateTime?

  // Verification
  proofDocUrl   String?  // S3 URL
  verified      Boolean  @default(false)
  verifiedBy    String?  // Admin userId
  verifiedAt    DateTime?

  createdAt     DateTime @default(now())
}

enum ShareType {
  COMMON
  PREFERRED_A
  PREFERRED_B
  OPTIONS
  WARRANTS
}
```

```prisma
// services/deals/prisma/schema.prisma
model Deal {
  id            String   @id @default(uuid())
  companyId     String

  // Deal basics
  name          String   // "Q4 2024 Liquidity Program"
  targetSize    Decimal  // Total $ target
  minTicket     Decimal  // Minimum buy-in
  pricePerShare Decimal? // Can be set later

  // Timeline
  openDate      DateTime
  commitDeadline DateTime
  closeDate     DateTime

  // Status
  status        DealStatus @default(DRAFT)

  // Stats (computed)
  totalSupply   Int?     // Total shares offered
  totalDemand   Decimal? // Total $ committed

  createdAt     DateTime @default(now())
}

enum DealStatus {
  DRAFT
  OPEN
  ALLOCATING
  CLOSING
  COMPLETE
}

model SellerParticipation {
  id            String   @id @default(uuid())
  dealId        String
  userId        String
  holdingId     String

  // What they want to sell
  sharesToSell  Int
  minimumPrice  Decimal? // Optional

  // Admin controls
  status        ParticipationStatus @default(SUBMITTED)
  approvedShares Int?    // Admin can adjust
  approvedBy    String?

  createdAt     DateTime @default(now())
}

model BuyerCommitment {
  id            String   @id @default(uuid())
  dealId        String
  userId        String

  // What they want to buy
  commitmentAmount Decimal

  // Admin controls
  status        CommitmentStatus @default(SUBMITTED)
  allocatedAmount Decimal?  // Set by admin
  allocatedBy   String?

  createdAt     DateTime @default(now())
}
```

#### 4. Essential APIs for Week 1

```typescript
// Core endpoints we need working

// Holdings
POST   /api/holdings
GET    /api/holdings/my
POST   /api/holdings/:id/upload-proof

// Deals (simplified for MVP)
GET    /api/deals/active         // Returns the one active deal
GET    /api/deals/:id            // Deal details

// Seller participation
POST   /api/deals/:id/participate
GET    /api/participations/my

// Buyer commitment
POST   /api/deals/:id/commit
GET    /api/commitments/my

// Admin basics
GET    /api/admin/users
GET    /api/admin/holdings
GET    /api/admin/deals/:id/participants
PUT    /api/admin/holdings/:id/verify
```

### Friday: Admin Dashboard v1

#### 5. Admin Pages (Minimal but Functional)

**`/admin` - Dashboard home**
```jsx
// Quick stats cards
Active Deal: [Company Name - Q4 2024]
Total Sellers: 12
Total Buyers: 8
Deal Status: OPEN

// Quick actions
[View Participants] [View Holdings] [Export Data]
```

**`/admin/holdings` - Review holdings**
```jsx
// Table with:
User | Company | Type | Quantity | Proof | Status | Actions
-----|---------|------|----------|--------|--------|--------
John | Acme    | Common | 10,000 | [View] | Pending | [Verify] [Reject]
```

**`/admin/deal/[id]` - Deal management**
```jsx
// Two tabs: Sellers | Buyers

Sellers Tab:
Name | Shares Offered | Min Price | Status | Approved Shares | Actions
-----|----------------|-----------|--------|-----------------|--------
John | 5,000         | $12       | Verified | [5000] | [Save]

Buyers Tab:
Name | Committed | Accredited | Status | Allocated | Actions
-----|-----------|------------|--------|-----------|--------
Sarah | $50,000  | Yes        | Approved | [$35,000] | [Save]

[Lock Allocations] // Big button when ready
```

### What We're NOT Doing This Week

❌ Email notifications (console.log for now)
❌ Document generation (just track status)
❌ Payment processing (manual tracking)
❌ Complex validation (basic only)
❌ Beautiful UI (functional Bootstrap/Tailwind)

### File Structure to Create

```
web/investor-portal/src/
  pages/
    auth/
      signup.tsx       // Role selection
      login.tsx
    seller/
      onboarding.tsx   // Multi-step form
      dashboard.tsx    // Status view
      holdings.tsx     // Manage holdings
    buyer/
      onboarding.tsx   // Accreditation
      dashboard.tsx    // Commitments view
      deal.tsx         // Deal details + commit
    admin/
      index.tsx        // Dashboard
      holdings.tsx     // Review holdings
      deal/[id].tsx    // Manage participants

  components/
    auth/
      RoleSelector.tsx
    seller/
      HoldingForm.tsx
      ConsentForm.tsx
    buyer/
      AccreditationForm.tsx
      CommitmentForm.tsx
    admin/
      HoldingsTable.tsx
      ParticipantsTable.tsx
      AllocationControls.tsx

  lib/
    api/
      holdings.ts
      deals.ts
      admin.ts
```

### Simplified Services Structure

For Week 1, we really only need:
1. **Identity Service** - Auth + user profiles (already working!)
2. **Holdings Service** - Track what people own
3. **Deals Service** - The active deal + participations

We can ignore the other 9 services for now!

### Database Setup for Week 1

```sql
-- Quick seed data for testing

-- Create test company
INSERT INTO companies (id, name, ticker)
VALUES ('acme-uuid', 'Acme Corp', 'ACME');

-- Create test deal
INSERT INTO deals (id, company_id, name, target_size, min_ticket, status, open_date, commit_deadline)
VALUES ('deal-1', 'acme-uuid', 'Q4 2024 Liquidity Program', 5000000, 25000, 'OPEN', NOW(), NOW() + INTERVAL '14 days');

-- You'll add test users through the UI
```

### Success Criteria for Week 1

By Friday, you should be able to:
1. ✅ Sign up as seller or buyer
2. ✅ Add holdings as a seller
3. ✅ View the active deal
4. ✅ Submit participation (seller) or commitment (buyer)
5. ✅ Log in as admin and see all participants
6. ✅ Manually verify holdings and set allocations

If you can do these 6 things, Week 1 is DONE.

### Commands to Run Right Now

```bash
# 1. Focus on just 3 services
cd services/identity && pnpm dev    # Port 3001 (working!)
cd services/holdings && pnpm dev    # Port 3004
cd services/deals && pnpm dev       # Port 3006

# 2. Update the frontend to focus on MVP
cd web/investor-portal
# Start building the pages listed above

# 3. Create simplified API client
# Forget about 12 microservices - just hit 3 endpoints
```

This is your Week 1. Nothing else matters. Ship these features and you have a working MVP that can facilitate a real deal!