import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PriceSource, FairValueLevel, ValuationType } from '@prisma/client';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async recordPrice(data: {
    companyId: string;
    securityClassId: string;
    price: number;
    source: PriceSource;
    priceDate?: Date;
  }) {
    return this.prisma.securityPrice.create({
      data: {
        ...data,
        priceDate: data.priceDate || new Date(),
      },
    });
  }

  async getLatestPrice(companyId: string, securityClassId: string) {
    return this.prisma.securityPrice.findFirst({
      where: { companyId, securityClassId },
      orderBy: { priceDate: 'desc' },
    });
  }

  async getPriceHistory(
    companyId: string,
    securityClassId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.prisma.securityPrice.findMany({
      where: {
        companyId,
        securityClassId,
        priceDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { priceDate: 'asc' },
    });
  }

  async calculateValuation(
    companyId: string,
    securityClassId: string,
    modelType: ValuationType,
    parameters: any,
  ) {
    // Simplified valuation calculation
    let calculatedPrice = 0;

    switch (modelType) {
      case 'DCF':
        calculatedPrice = this.calculateDCF(parameters);
        break;
      case 'COMPARABLE_COMPANY':
        calculatedPrice = this.calculateComparables(parameters);
        break;
      case 'VENTURE_CAPITAL':
        calculatedPrice = this.calculateVC(parameters);
        break;
      default:
        calculatedPrice = parameters.basePrice || 0;
    }

    return this.prisma.valuationModel.create({
      data: {
        companyId,
        securityClassId,
        modelType,
        parameters,
        calculatedPrice,
        confidence: 0.75,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    });
  }

  private calculateDCF(params: any): number {
    const { fcf, growthRate, discountRate, terminalGrowthRate, years } = params;
    let presentValue = 0;

    for (let i = 1; i <= years; i++) {
      const futureFCF = fcf * Math.pow(1 + growthRate, i);
      presentValue += futureFCF / Math.pow(1 + discountRate, i);
    }

    const terminalValue =
      (fcf * Math.pow(1 + growthRate, years) * (1 + terminalGrowthRate)) /
      (discountRate - terminalGrowthRate);
    presentValue += terminalValue / Math.pow(1 + discountRate, years);

    return presentValue / (params.sharesOutstanding || 1);
  }

  private calculateComparables(params: any): number {
    const { revenue, revenueMultiple } = params;
    return (revenue * revenueMultiple) / (params.sharesOutstanding || 1);
  }

  private calculateVC(params: any): number {
    const { postMoneyValuation, sharesOutstanding } = params;
    return postMoneyValuation / sharesOutstanding;
  }

  async recordFairValue(data: {
    companyId: string;
    securityClassId: string;
    fairValue: number;
    level: FairValueLevel;
    inputs: any;
  }) {
    return this.prisma.fairValueMeasurement.create({
      data: {
        ...data,
        measurementDate: new Date(),
      },
    });
  }
}
