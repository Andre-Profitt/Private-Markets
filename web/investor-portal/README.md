# Investor Portal - Private Assets Platform

Next.js-based investor portal for managing private market investments.

## Features

- ✅ User authentication (login/register)
- ✅ Dashboard with portfolio overview
- ✅ Profile management with KYC/accreditation status
- ✅ Holdings and positions tracking
- ✅ Transaction history
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **State Management**: React Context API
- **API Integration**: Fetch API with custom client
- **Type Safety**: TypeScript

## Setup

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Backend services running (Identity, Profiles, Companies, Holdings)

### Installation

```bash
cd web/investor-portal
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_IDENTITY_API_URL=http://localhost:3001
NEXT_PUBLIC_PROFILES_API_URL=http://localhost:3002
NEXT_PUBLIC_COMPANIES_API_URL=http://localhost:3003
NEXT_PUBLIC_HOLDINGS_API_URL=http://localhost:3004
```

### Development

```bash
pnpm dev
```

The app will run on http://localhost:3100

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Landing page
├── components/
│   ├── layout/            # Layout components (DashboardNav)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api-client.ts      # API client for all backend services
│   ├── auth-context.tsx   # Authentication context and hooks
│   └── types.ts           # TypeScript type definitions
└── styles/
    └── globals.css        # Global styles with Tailwind
```

## Pages

### Public Pages

- `/` - Landing page
- `/login` - Login page (demo credentials available)
- `/register` - Registration page

### Protected Pages (Require Login)

- `/dashboard` - Main dashboard with portfolio summary
- `/profile` - User profile with KYC and accreditation status
- `/holdings` - Holdings and positions view
- `/companies` - Browse companies (placeholder)

## Authentication

The app uses JWT-based authentication with:

- Access tokens (short-lived)
- Refresh tokens (long-lived, stored in localStorage)
- Automatic token refresh
- Protected routes with auth check

### Demo Credentials

```
Email: admin@platform.com
Password: admin123
```

## API Integration

The frontend integrates with 4 backend microservices:

1. **Identity Service** (Port 3001)
   - User authentication
   - User management

2. **Profiles Service** (Port 3002)
   - Profile CRUD
   - KYC verification
   - Accreditation status

3. **Companies Service** (Port 3003)
   - Company listings
   - Security classes
   - Valuations

4. **Holdings Service** (Port 3004)
   - User holdings
   - Positions
   - Transactions

## Key Features

### Dashboard

- Portfolio summary cards (positions, companies, total invested)
- Profile completion status
- Quick actions menu
- Responsive grid layout

### Profile Page

- Profile information display
- KYC verification status with check breakdown
- Start KYC checks (Identity, Address)
- Accreditation status with expiration tracking

### Holdings Page

- Positions table with cost basis
- Recent transactions list
- Status badges (settled, pending, etc.)
- Empty state handling

## Development Guidelines

### Adding New Pages

1. Create page in appropriate directory under `src/app`
2. Use `'use client'` for client components
3. Implement loading and error states
4. Add navigation link in `DashboardNav.tsx`

### API Integration

1. Add method to `api-client.ts`
2. Import and use in component
3. Handle loading and error states
4. Use TypeScript types from `types.ts`

### Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme (blue primary)
- Ensure responsive design (mobile-first)
- Use status badges for states

## TODO / Future Enhancements

- [ ] Companies browse page
- [ ] Company detail view
- [ ] Investment/order placement
- [ ] Document uploads for KYC
- [ ] Portfolio performance charts
- [ ] Transaction filtering and search
- [ ] Mobile menu for navigation
- [ ] Dark mode support
- [ ] Notification system
- [ ] Real-time updates with WebSockets

## Notes

- All monetary values are formatted as USD
- Dates are displayed in local format
- Status badges use color coding (green=success, yellow=pending, red=error)
- Empty states provide clear CTAs
- All API errors are logged to console
