import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    // Validate market order doesn't have price
    if (createOrderDto.orderType === 'MARKET' && createOrderDto.price) {
      throw new BadRequestException('Market orders cannot have a price');
    }

    // Validate limit order has price
    if (createOrderDto.orderType === 'LIMIT' && !createOrderDto.price) {
      throw new BadRequestException('Limit orders must have a price');
    }

    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        remainingQuantity: createOrderDto.quantity,
        status: 'OPEN',
        expiresAt: createOrderDto.expiresAt ? new Date(createOrderDto.expiresAt) : undefined,
      },
    });

    await this.createAuditLog('Order', order.id, 'CREATE', order.userId);

    // Trigger matching engine
    await this.matchOrder(order.id);

    return order;
  }

  async matchOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'OPEN') return;

    // Find opposite side orders
    const oppositeSide = order.side === 'BUY' ? 'SELL' : 'BUY';
    const oppositeOrders = await this.prisma.order.findMany({
      where: {
        companyId: order.companyId,
        securityClassId: order.securityClassId,
        side: oppositeSide,
        status: 'OPEN',
        remainingQuantity: { gt: 0 },
      },
      orderBy: [
        { price: order.side === 'BUY' ? 'asc' : 'desc' },
        { createdAt: 'asc' },
      ],
    });

    for (const oppositeOrder of oppositeOrders) {
      if (Number(order.remainingQuantity) <= 0) break;

      // Check price compatibility
      if (order.orderType === 'LIMIT' && oppositeOrder.price) {
        if (order.side === 'BUY' && Number(order.price) < Number(oppositeOrder.price)) continue;
        if (order.side === 'SELL' && Number(order.price) > Number(oppositeOrder.price)) continue;
      }

      // Execute trade
      const quantity = Math.min(
        Number(order.remainingQuantity),
        Number(oppositeOrder.remainingQuantity)
      );
      const price = Number(oppositeOrder.price || order.price || 0);

      await this.executeOrder(order.id, oppositeOrder.id, quantity, price);
    }

    // Update order status
    const updatedOrder = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (updatedOrder && Number(updatedOrder.remainingQuantity) === 0) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'FILLED' },
      });
    }
  }

  async executeOrder(buyOrderId: string, sellOrderId: string, quantity: number, price: number) {
    const totalAmount = quantity * price;
    const buyerFee = totalAmount * 0.01; // 1% fee
    const sellerFee = totalAmount * 0.01;

    const execution = await this.prisma.execution.create({
      data: {
        orderId: buyOrderId,
        buyOrderId,
        sellOrderId,
        quantity,
        price,
        totalAmount,
        buyerFee,
        sellerFee,
        status: 'SETTLED',
        settledAt: new Date(),
      },
    });

    // Update both orders
    await this.prisma.order.update({
      where: { id: buyOrderId },
      data: {
        filledQuantity: { increment: quantity },
        remainingQuantity: { decrement: quantity },
      },
    });

    await this.prisma.order.update({
      where: { id: sellOrderId },
      data: {
        filledQuantity: { increment: quantity },
        remainingQuantity: { decrement: quantity },
      },
    });

    // Create trade record
    const order = await this.prisma.order.findUnique({ where: { id: buyOrderId } });
    await this.prisma.trade.create({
      data: {
        executionId: execution.id,
        companyId: order.companyId,
        securityClassId: order.securityClassId,
        price,
        quantity,
        totalAmount,
      },
    });

    // Update order book
    await this.updateOrderBook(order.companyId, order.securityClassId);

    return execution;
  }

  async updateOrderBook(companyId: string, securityClassId: string) {
    const [buyOrders, sellOrders, lastTrade] = await Promise.all([
      this.prisma.order.findFirst({
        where: { companyId, securityClassId, side: 'BUY', status: 'OPEN' },
        orderBy: { price: 'desc' },
      }),
      this.prisma.order.findFirst({
        where: { companyId, securityClassId, side: 'SELL', status: 'OPEN' },
        orderBy: { price: 'asc' },
      }),
      this.prisma.trade.findFirst({
        where: { companyId, securityClassId },
        orderBy: { tradedAt: 'desc' },
      }),
    ]);

    await this.prisma.orderBook.upsert({
      where: {
        companyId_securityClassId: { companyId, securityClassId },
      },
      update: {
        bestBidPrice: buyOrders?.price,
        bestAskPrice: sellOrders?.price,
        lastTradePrice: lastTrade?.price,
      },
      create: {
        companyId,
        securityClassId,
        bestBidPrice: buyOrders?.price,
        bestAskPrice: sellOrders?.price,
        lastTradePrice: lastTrade?.price,
      },
    });
  }

  async getOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { executions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderBook(companyId: string, securityClassId: string) {
    const [orderBook, buyOrders, sellOrders] = await Promise.all([
      this.prisma.orderBook.findUnique({
        where: { companyId_securityClassId: { companyId, securityClassId } },
      }),
      this.prisma.order.findMany({
        where: { companyId, securityClassId, side: 'BUY', status: 'OPEN' },
        orderBy: { price: 'desc' },
        take: 10,
      }),
      this.prisma.order.findMany({
        where: { companyId, securityClassId, side: 'SELL', status: 'OPEN' },
        orderBy: { price: 'asc' },
        take: 10,
      }),
    ]);

    return {
      orderBook,
      bids: buyOrders,
      asks: sellOrders,
    };
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    if (order.status !== 'OPEN') {
      throw new BadRequestException('Only open orders can be cancelled');
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.createAuditLog('Order', id, 'CANCEL', userId);

    return { message: 'Order cancelled successfully' };
  }

  private async createAuditLog(
    entityType: string,
    entityId: string,
    action: string,
    userId: string | null,
  ) {
    await this.prisma.auditLog.create({
      data: { entityType, entityId, action, userId },
    });
  }
}
