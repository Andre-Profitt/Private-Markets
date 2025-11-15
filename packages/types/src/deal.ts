export interface Deal {
  id: string;
  companyId: string;
  type: 'SECONDARY' | 'LIQUIDITY_PROGRAM';
  targetSize?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealParticipant {
  dealId: string;
  userId: string;
  role: 'BUYER' | 'SELLER';
  allocatedAmount?: number;
}
