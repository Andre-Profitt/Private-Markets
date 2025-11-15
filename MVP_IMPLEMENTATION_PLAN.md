# MVP Implementation Plan: Real Secondary Trading Platform

## Goal: Ship a working product that can close actual deals in 30 days

## What We're Building (The Reality)

**One Company. One Deal. Real Money.**

We're building a platform that can handle a single company's liquidity program where:
- Employees/early investors can sell shares
- Accredited investors can buy shares
- You manually coordinate everything that matters
- The platform tracks the source of truth

## Core User Flows (What Actually Matters)

### 1. Seller Flow (Employee/Early Investor)
```
Sign Up → Add Holdings → Join Deal → Track Status → Get Paid
```

### 2. Buyer Flow (Accredited Investor)
```
Sign Up → Self-Accredit → View Deal → Commit Funds → Track Status → Wire Money
```

### 3. Admin Flow (You)
```
Review Users → Verify Holdings → Set Allocations → Track Docs/Payments → Close Deal
```

## Week 1: Core Infrastructure & Basic Flows

### Backend Focus (Simplified)
```javascript
// Core Models Only
User: email, password, role, profile
Holding: userId, companyId, shareType, quantity, proofDocs
Deal: companyId, targetSize, priceRange, status, dates
SellerParticipation: dealId, userId, requestedShares, minPrice, status
BuyerCommitment: dealId, userId, amount, status, allocatedAmount
```

### Frontend Screens (Day 1-3)
1. **Auth Pages**
   - `/login` - Simple email/password
   - `/signup` - Basic registration with role selection (seller/buyer)

2. **Seller Onboarding**
   - `/onboarding/holdings` - Add what you own
   - `/onboarding/verify` - Upload proof docs

3. **Buyer Onboarding**
   - `/onboarding/accreditation` - Self-certification form
   - `/onboarding/documents` - Upload supporting docs

### API Endpoints (Day 4-5)
```typescript
// Week 1 APIs - Just the essentials
POST   /auth/register
POST   /auth/login
GET    /profile/me
PUT    /profile/me

POST   /holdings                   // Add holding
GET    /holdings/my                // Get my holdings
POST   /holdings/:id/documents     // Upload proof

GET    /deals/active               // Get current deal
POST   /deals/:id/participate     // Seller: Join deal
POST   /deals/:id/commit          // Buyer: Commit funds
```

### Admin Dashboard (Day 6-7)
- `/admin/users` - Simple table of all users
- `/admin/holdings` - Review uploaded holdings
- `/admin/deal` - See deal overview

## Week 2: Deal Management & Status Tracking

### Enhanced Models
```javascript
// Add workflow states
SellerParticipation.status:
  'submitted' | 'verified' | 'approved' | 'allocated' | 'docs_signed' | 'paid'

BuyerCommitment.status:
  'submitted' | 'approved' | 'allocated' | 'docs_signed' | 'funded' | 'complete'
```

### Seller Dashboard
- `/dashboard` - My deal status with visual timeline
- `/deals/:id/status` - Detailed status page

### Buyer Dashboard
- `/dashboard` - My commitment & allocation
- `/deals/:id/status` - Deal details and my status

### Admin Controls
```typescript
// Admin APIs for manual operations
PUT /admin/holdings/:id/verify    // Mark holding as verified
PUT /admin/participations/:id     // Update seller status & approved shares
PUT /admin/commitments/:id        // Set allocation for buyer
POST /admin/deals/:id/lock        // Lock allocations, trigger next phase
```

## Week 3: Documentation & Payment Tracking

### Simple Document Tracking
```javascript
DocumentStatus: {
  userId,
  dealId,
  documentType: 'purchase_agreement' | 'w9' | 'accreditation',
  status: 'pending' | 'sent' | 'signed',
  docusignEnvelopeId: optional
}
```

### Payment Tracking
```javascript
PaymentStatus: {
  userId,
  dealId,
  type: 'incoming' | 'outgoing',
  amount,
  status: 'pending' | 'sent' | 'confirmed',
  wireReference: optional
}
```

### Email Notifications (Templates)
1. Welcome & next steps
2. Deal participation confirmed
3. Allocation confirmed (with amount)
4. Documents ready to sign
5. Payment instructions
6. Deal complete

### Admin Tools
- `/admin/documents` - Track who signed what
- `/admin/payments` - Track money flow
- "Send Docs" button → Triggers DocuSign or email
- "Mark Paid" button → Manual confirmation

## Week 4: Polish & Go Live

### Critical Features for Real Money
1. **Audit Logging**
   ```javascript
   AuditLog: {
     userId,
     action,
     entityType,
     entityId,
     oldValue,
     newValue,
     timestamp,
     ip
   }
   ```

2. **Data Exports**
   - Export deal participants as CSV
   - Export allocations for legal/finance
   - Export payment reconciliation

3. **Security Basics**
   - Encrypt PII in database
   - Add rate limiting
   - Add session management
   - Add 2FA for admin accounts

4. **Legal/Compliance**
   - Terms checkbox on every commitment
   - Risk disclosures prominent
   - Accreditation attestation with timestamp
   - Data retention policy

## What We're NOT Building (Yet)

❌ Multiple simultaneous deals
❌ Automated KYC/AML vendors
❌ Direct bank/payment integration
❌ Complex matching algorithms
❌ Secondary marketplace
❌ Mobile apps
❌ Real-time chat
❌ Advanced analytics

## Manual Operations Playbook

### For KYC/Accreditation
1. User uploads docs in app
2. Compliance person downloads, reviews
3. Maybe run through third-party service manually
4. Mark as "Verified" in admin panel

### For Documents
1. Admin clicks "Send Docs" in panel
2. System either:
   - Triggers DocuSign template, OR
   - Sends email with PDF attachments
3. Participants sign outside platform
4. Admin marks as "Signed" when complete

### For Payments
1. Admin sends wire instructions via email template
2. Participants wire funds to escrow
3. Finance team confirms receipt
4. Admin marks as "Funded" in system
5. After settlement, mark as "Complete"

## API Specification for Core Endpoints

### Seller: Submit Participation
```typescript
POST /api/deals/{dealId}/participate
Request:
{
  "holdingId": "uuid",
  "sharesToSell": 5000,
  "minimumPrice": 12.50  // optional
}

Response:
{
  "participationId": "uuid",
  "status": "submitted",
  "estimatedValue": 62500,
  "nextSteps": "Awaiting verification"
}
```

### Buyer: Submit Commitment
```typescript
POST /api/deals/{dealId}/commit
Request:
{
  "commitmentAmount": 50000,
  "accreditationId": "uuid"
}

Response:
{
  "commitmentId": "uuid",
  "status": "submitted",
  "minimumTicket": 25000,
  "maximumTicket": 500000,
  "nextSteps": "Awaiting allocation"
}
```

### Admin: Set Allocations
```typescript
PUT /api/admin/commitments/{commitmentId}
Request:
{
  "allocatedAmount": 35000,
  "status": "allocated",
  "notes": "Pro-rata allocation based on commitment"
}
```

## Success Metrics for MVP

✅ Can onboard 10 sellers and 10 buyers
✅ Can run one complete deal cycle (intake → allocation → settlement)
✅ Can track every participant's status accurately
✅ Can generate reports for legal/compliance
✅ No manual spreadsheet reconciliation needed
✅ All participants know their status at all times
✅ You can sleep at night (basic security in place)

## Day-by-Day Implementation Guide

### Days 1-3: Authentication & Basic Profile
- Set up JWT auth with roles (SELLER, BUYER, ADMIN)
- Create profile pages
- Basic navigation and layout

### Days 4-6: Holdings Management
- Holdings CRUD
- Document upload to S3/CloudStorage
- Admin review interface

### Days 7-9: Deal Creation & Display
- Deal model and display pages
- Seller participation flow
- Buyer commitment flow

### Days 10-12: Admin Dashboard Core
- User management
- Holdings verification
- Deal overview with stats

### Days 13-15: Status Tracking
- Status state machines
- Timeline UI components
- Email notification system

### Days 16-18: Allocation Management
- Admin allocation interface
- Locking mechanism
- Participant notifications

### Days 19-21: Document Tracking
- Document status tracking
- DocuSign integration or email fallback
- Admin document dashboard

### Days 22-24: Payment Tracking
- Payment status models
- Wire instruction generation
- Payment confirmation flow

### Days 25-27: Security & Polish
- Audit logging
- Data encryption
- Error handling
- UI polish

### Days 28-30: Testing & Launch
- End-to-end testing with real scenario
- Load testing
- Security review
- Soft launch with friendly users

## The "Just Ship It" Mindset

Remember:
1. **Manual is fine** - You're the algorithm for now
2. **Simple is better** - Every feature is a potential bug
3. **Track everything** - Data is your source of truth
4. **Communicate clearly** - Users should never be confused
5. **Security basics only** - Don't overcomplicate, but don't be negligent

## Next Steps

1. Pick your pilot company (one you have a relationship with)
2. Identify 3-5 friendly sellers (employees who want liquidity)
3. Identify 3-5 friendly buyers (angels who trust you)
4. Set a deal date 45 days out
5. Start coding Week 1 features TODAY

This isn't about building the perfect platform. It's about building something that works, closes deals, and makes money. Everything else can come later.