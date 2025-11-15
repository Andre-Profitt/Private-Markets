import { Injectable } from '@nestjs/common';

export interface KycCheckResult {
  success: boolean;
  referenceId: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  riskScore: number;
  result: any;
}

@Injectable()
export class MockKycProvider {
  async verifyIdentity(data: any): Promise<KycCheckResult> {
    // Simulate API delay
    await this.delay(1000);

    // Mock verification logic
    const approved = Math.random() > 0.2; // 80% approval rate

    return {
      success: true,
      referenceId: `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: approved ? 'APPROVED' : 'REJECTED',
      riskScore: approved ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 40 + 60),
      result: {
        provider: 'MOCK',
        timestamp: new Date().toISOString(),
        checks: {
          documentAuthenticity: approved,
          faceMatch: approved,
          livenessCheck: approved,
        },
        reason: approved ? 'All checks passed' : 'Failed document verification',
      },
    };
  }

  async verifyAddress(data: any): Promise<KycCheckResult> {
    await this.delay(800);

    const approved = Math.random() > 0.15;

    return {
      success: true,
      referenceId: `MOCK-ADDR-${Date.now()}`,
      status: approved ? 'APPROVED' : 'REJECTED',
      riskScore: approved ? Math.floor(Math.random() * 25) : Math.floor(Math.random() * 50 + 50),
      result: {
        provider: 'MOCK',
        addressMatched: approved,
        documentType: 'UTILITY_BILL',
        addressLine: data.street,
        city: data.city,
        country: data.country,
      },
    };
  }

  async screenSanctions(data: any): Promise<KycCheckResult> {
    await this.delay(600);

    // Very low match rate for sanctions
    const matched = Math.random() < 0.05;

    return {
      success: true,
      referenceId: `MOCK-SANC-${Date.now()}`,
      status: matched ? 'REJECTED' : 'APPROVED',
      riskScore: matched ? 95 : Math.floor(Math.random() * 20),
      result: {
        provider: 'MOCK',
        listsChecked: ['OFAC', 'EU Sanctions', 'UN Sanctions'],
        matchesFound: matched ? 1 : 0,
        matches: matched ? [{
          name: 'Similar Name Found',
          listName: 'OFAC',
          matchScore: 0.85,
        }] : [],
      },
    };
  }

  async screenPEP(data: any): Promise<KycCheckResult> {
    await this.delay(700);

    const isPEP = Math.random() < 0.1;

    return {
      success: true,
      referenceId: `MOCK-PEP-${Date.now()}`,
      status: 'APPROVED', // PEP status doesn't auto-reject
      riskScore: isPEP ? Math.floor(Math.random() * 30 + 40) : Math.floor(Math.random() * 30),
      result: {
        provider: 'MOCK',
        isPEP,
        pepCategory: isPEP ? 'FORMER_PEP' : null,
        adverseMediaFound: false,
      },
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
