import { z } from 'zod';

export const OrderCreatedEventSchema = z.object({
  orderId: z.string(),
  userId: z.string(),
  companyId: z.string(),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number(),
  price: z.number().optional(),
  createdAt: z.string(),
});

export type OrderCreatedEvent = z.infer<typeof OrderCreatedEventSchema>;

export const TradeExecutedEventSchema = z.object({
  tradeId: z.string(),
  buyOrderId: z.string(),
  sellOrderId: z.string(),
  companyId: z.string(),
  quantity: z.number(),
  price: z.number(),
  executedAt: z.string(),
});

export type TradeExecutedEvent = z.infer<typeof TradeExecutedEventSchema>;
