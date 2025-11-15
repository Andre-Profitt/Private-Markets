export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: string;
  roles: Array<{
    role: {
      name: string;
    };
  }>;
}

export interface UserProfile {
  id: string;
  userId: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  profileComplete: boolean;
}

export interface KycStatus {
  overallStatus: string;
  checks: Array<{
    id: string;
    checkType: string;
    status: string;
    completedAt?: string;
  }>;
}

export interface AccreditationStatus {
  id: string;
  verificationType: string;
  status: string;
  verifiedAt?: string;
  expiresAt?: string;
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  businessType: string;
  industry?: string;
  description?: string;
  logoUrl?: string;
  status: string;
  securityClasses: SecurityClass[];
  valuations: Valuation[];
}

export interface SecurityClass {
  id: string;
  name: string;
  classType: string;
  authorizedShares: number;
  outstandingShares: number;
  liquidationPreference?: number;
  votingRights: boolean;
}

export interface Valuation {
  id: string;
  valuationDate: string;
  pricePerShare: number;
  totalValuation: number;
  valuationType: string;
}

export interface Holding {
  id: string;
  companyId: string;
  securityClassId: string;
  sharesOwned: number;
  costBasis?: number;
  totalCost?: number;
  acquisitionDate: string;
  acquisitionMethod: string;
  status: string;
  isRestricted: boolean;
}

export interface Position {
  companyId: string;
  securityClassId: string;
  totalShares: number;
  averageCost: number;
  totalCost: number;
  firstAcquired: string;
  holdings: Array<{
    id: string;
    shares: number;
    costBasis: number;
    acquisitionDate: string;
    isRestricted: boolean;
  }>;
}

export interface Transaction {
  id: string;
  transactionType: string;
  transactionDate: string;
  shares: number;
  pricePerShare?: number;
  totalAmount?: number;
  status: string;
}
