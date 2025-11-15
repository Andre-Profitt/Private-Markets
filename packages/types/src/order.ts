export interface Order {
  id: string;
  userId: string;
  companyId: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  id: string;
  companyId: string;
  type: 'SELL' | 'BUY';
  minSize: number;
  priceGuidance?: number;
  status: 'OPEN' | 'CLOSED';
}
