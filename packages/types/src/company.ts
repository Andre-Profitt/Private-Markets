export interface Company {
  id: string;
  name: string;
  ticker?: string;
  sector?: string;
  jurisdiction: string;
  lastValuation?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityClass {
  id: string;
  companyId: string;
  type: 'COMMON' | 'PREFERRED' | 'OPTIONS' | 'WARRANTS';
  name: string;
  description?: string;
}
