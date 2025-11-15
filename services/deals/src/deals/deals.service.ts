import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async createDeal(data: any) {
    const deal = await this.prisma.deal.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
    return deal;
  }

  async getDeals(status?: string) {
    return this.prisma.deal.findMany({
      where: status ? { status: status as any } : undefined,
      include: { investments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDeal(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: { investments: true },
    });
    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async invest(dealId: string, userId: string, amount: number) {
    const deal = await this.getDeal(dealId);
    
    if (deal.status !== 'OPEN') {
      throw new BadRequestException('Deal is not open for investment');
    }

    if (amount < Number(deal.minInvestment)) {
      throw new BadRequestException('Amount below minimum investment');
    }

    const shares = amount / Number(deal.pricePerShare);

    const investment = await this.prisma.investment.create({
      data: {
        dealId,
        userId,
        amount,
        shares,
        status: 'APPROVED',
      },
    });

    await this.prisma.deal.update({
      where: { id: dealId },
      data: {
        raisedAmount: { increment: amount },
        investorCount: { increment: 1 },
      },
    });

    return investment;
  }
}
