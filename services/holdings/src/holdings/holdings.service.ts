import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class HoldingsService {
  constructor(private prisma: PrismaService) {}

  // ====================
  // Holdings Management
  // ====================

  async createHolding(createHoldingDto: CreateHoldingDto) {
    const holding = await this.prisma.holding.create({
      data: {
        ...createHoldingDto,
        acquisitionDate: new Date(createHoldingDto.acquisitionDate),
        restrictionEndDate: createHoldingDto.restrictionEndDate
          ? new Date(createHoldingDto.restrictionEndDate)
          : undefined,
      },
    });

    // Create initial transaction record
    await this.prisma.transaction.create({
      data: {
        userId: holding.userId,
        holdingId: holding.id,
        companyId: holding.companyId,
        securityClassId: holding.securityClassId,
        transactionType: this.mapAcquisitionToTransactionType(holding.acquisitionMethod),
        transactionDate: holding.acquisitionDate,
        settlementDate: holding.acquisitionDate,
        shares: holding.sharesOwned,
        pricePerShare: holding.costBasis,
        totalAmount: holding.totalCost,
        status: 'SETTLED',
        notes: `Initial acquisition via ${holding.acquisitionMethod}`,
      },
    });

    await this.createAuditLog('Holding', holding.id, 'CREATE', holding.userId);

    return holding;
  }

  async findHoldingsByUser(userId: string) {
    return this.prisma.holding.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        transactions: {
          orderBy: { transactionDate: 'desc' },
          take: 5,
        },
      },
      orderBy: { acquisitionDate: 'desc' },
    });
  }

  async findHoldingById(id: string) {
    const holding = await this.prisma.holding.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { transactionDate: 'desc' },
        },
      },
    });

    if (!holding) {
      throw new NotFoundException(`Holding with ID ${id} not found`);
    }

    return holding;
  }

  async updateHolding(id: string, updateData: Partial<CreateHoldingDto>) {
    await this.findHoldingById(id);

    const holding = await this.prisma.holding.update({
      where: { id },
      data: {
        ...updateData,
        restrictionEndDate: updateData.restrictionEndDate
          ? new Date(updateData.restrictionEndDate)
          : undefined,
      },
    });

    await this.createAuditLog('Holding', id, 'UPDATE', holding.userId);

    return holding;
  }

  // ====================
  // Transaction Management
  // ====================

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        transactionDate: new Date(createTransactionDto.transactionDate),
        settlementDate: createTransactionDto.settlementDate
          ? new Date(createTransactionDto.settlementDate)
          : undefined,
      },
    });

    await this.createAuditLog('Transaction', transaction.id, 'CREATE', transaction.userId);

    return transaction;
  }

  async findTransactionsByUser(userId: string, limit = 50) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: 'desc' },
      take: limit,
    });
  }

  async findTransactionsByHolding(holdingId: string) {
    return this.prisma.transaction.findMany({
      where: { holdingId },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async updateTransactionStatus(id: string, status: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: { status: status as any },
    });

    await this.createAuditLog('Transaction', id, 'UPDATE_STATUS', transaction.userId);

    return updated;
  }

  // ====================
  // Position Management (Aggregated Holdings)
  // ====================

  async getPositionsByUser(userId: string) {
    const holdings = await this.prisma.holding.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    // Group holdings by company and security class
    const positionsMap = new Map<string, any>();

    for (const holding of holdings) {
      const key = `${holding.companyId}-${holding.securityClassId}`;

      if (!positionsMap.has(key)) {
        positionsMap.set(key, {
          userId: holding.userId,
          companyId: holding.companyId,
          securityClassId: holding.securityClassId,
          totalShares: 0,
          totalCost: 0,
          firstAcquired: holding.acquisitionDate,
          holdings: [],
        });
      }

      const position = positionsMap.get(key);
      position.totalShares += Number(holding.sharesOwned);
      position.totalCost += Number(holding.totalCost || 0);
      position.holdings.push({
        id: holding.id,
        shares: Number(holding.sharesOwned),
        costBasis: Number(holding.costBasis || 0),
        acquisitionDate: holding.acquisitionDate,
        isRestricted: holding.isRestricted,
      });

      if (holding.acquisitionDate < position.firstAcquired) {
        position.firstAcquired = holding.acquisitionDate;
      }
    }

    const positions = Array.from(positionsMap.values()).map((pos) => ({
      ...pos,
      averageCost: pos.totalCost / pos.totalShares,
    }));

    return positions;
  }

  async getPositionSummary(userId: string) {
    const positions = await this.getPositionsByUser(userId);

    const summary = {
      totalPositions: positions.length,
      totalCompanies: new Set(positions.map((p) => p.companyId)).size,
      totalShares: positions.reduce((sum, p) => sum + p.totalShares, 0),
      totalInvested: positions.reduce((sum, p) => sum + p.totalCost, 0),
      positions: positions.map((p) => ({
        companyId: p.companyId,
        securityClassId: p.securityClassId,
        totalShares: p.totalShares,
        averageCost: p.averageCost,
        totalCost: p.totalCost,
        holdingsCount: p.holdings.length,
      })),
    };

    return summary;
  }

  // ====================
  // Portfolio Analytics
  // ====================

  async createPortfolioSnapshot(userId: string) {
    const positions = await this.getPositionsByUser(userId);

    const totalCost = positions.reduce((sum, p) => sum + p.totalCost, 0);

    const snapshot = await this.prisma.portfolioSnapshot.create({
      data: {
        userId,
        snapshotDate: new Date(),
        totalValue: totalCost, // Would use actual valuations in production
        totalCost,
        unrealizedGain: 0, // Would calculate based on current valuations
        realizedGain: 0, // Would calculate from closed positions
        holdingsSummary: {
          positions: positions.map((p) => ({
            companyId: p.companyId,
            securityClassId: p.securityClassId,
            shares: p.totalShares,
            cost: p.totalCost,
          })),
        },
      },
    });

    return snapshot;
  }

  async getPortfolioHistory(userId: string, limit = 30) {
    return this.prisma.portfolioSnapshot.findMany({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }

  // ====================
  // Transfer Management
  // ====================

  async requestTransfer(fromUserId: string, toUserId: string, holdingId: string, shares: number, reason?: string) {
    const holding = await this.findHoldingById(holdingId);

    if (holding.userId !== fromUserId) {
      throw new BadRequestException('You do not own this holding');
    }

    if (Number(holding.sharesOwned) < shares) {
      throw new BadRequestException('Insufficient shares for transfer');
    }

    if (holding.isRestricted && holding.restrictionEndDate && new Date() < holding.restrictionEndDate) {
      throw new BadRequestException('Shares are still under restriction period');
    }

    const transferRequest = await this.prisma.transferRequest.create({
      data: {
        fromUserId,
        toUserId,
        holdingId,
        shares,
        reason,
      },
    });

    await this.createAuditLog('TransferRequest', transferRequest.id, 'CREATE', fromUserId);

    return transferRequest;
  }

  async approveTransfer(id: string, approvedBy: string) {
    const request = await this.prisma.transferRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Transfer request ${id} not found`);
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Transfer request is already ${request.status}`);
    }

    // Update transfer request
    await this.prisma.transferRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
      },
    });

    // Execute transfer (simplified - would need more complex logic for partial transfers)
    const holding = await this.findHoldingById(request.holdingId);

    // Create transaction records
    await this.prisma.transaction.create({
      data: {
        userId: request.fromUserId,
        holdingId: request.holdingId,
        companyId: holding.companyId,
        securityClassId: holding.securityClassId,
        transactionType: 'TRANSFER_OUT',
        transactionDate: new Date(),
        settlementDate: new Date(),
        shares: request.shares,
        status: 'SETTLED',
        counterpartyUserId: request.toUserId,
        notes: `Transfer to user ${request.toUserId}`,
      },
    });

    await this.prisma.transaction.create({
      data: {
        userId: request.toUserId,
        companyId: holding.companyId,
        securityClassId: holding.securityClassId,
        transactionType: 'TRANSFER_IN',
        transactionDate: new Date(),
        settlementDate: new Date(),
        shares: request.shares,
        status: 'SETTLED',
        counterpartyUserId: request.fromUserId,
        notes: `Transfer from user ${request.fromUserId}`,
      },
    });

    // Mark request as completed
    await this.prisma.transferRequest.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    await this.createAuditLog('TransferRequest', id, 'APPROVE', approvedBy);

    return { message: 'Transfer approved and executed successfully' };
  }

  // ====================
  // Helper Methods
  // ====================

  private mapAcquisitionToTransactionType(method: string): any {
    const mapping: Record<string, any> = {
      PURCHASE: 'BUY',
      GRANT: 'GRANT',
      EXERCISE: 'EXERCISE',
      TRANSFER: 'TRANSFER_IN',
      CONVERSION: 'CONVERSION',
      DIVIDEND: 'DIVIDEND',
      OTHER: 'BUY',
    };
    return mapping[method] || 'BUY';
  }

  private async createAuditLog(
    entityType: string,
    entityId: string,
    action: string,
    userId: string | null,
    changes?: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        action,
        userId,
        changes,
      },
    });
  }
}
