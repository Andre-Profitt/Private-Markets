import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  GRANT = 'GRANT',
  EXERCISE = 'EXERCISE',
  CONVERSION = 'CONVERSION',
  SPLIT = 'SPLIT',
  DIVIDEND = 'DIVIDEND',
  CANCELLATION = 'CANCELLATION',
}

export class CreateTransactionDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ example: 'holding-uuid' })
  @IsOptional()
  @IsString()
  holdingId?: string;

  @ApiProperty({ example: 'company-uuid' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'security-class-uuid' })
  @IsString()
  securityClassId: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.BUY })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty({ example: '2024-03-15' })
  @IsDateString()
  transactionDate: string;

  @ApiPropertyOptional({ example: '2024-03-17' })
  @IsOptional()
  @IsDateString()
  settlementDate?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  shares: number;

  @ApiPropertyOptional({ example: 12.50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerShare?: number;

  @ApiPropertyOptional({ example: 6250 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fees?: number;

  @ApiPropertyOptional({ example: 'order-uuid' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ example: 'counterparty-user-uuid' })
  @IsOptional()
  @IsString()
  counterpartyUserId?: string;

  @ApiPropertyOptional({ example: 'Purchase from Series B offering' })
  @IsOptional()
  @IsString()
  notes?: string;
}
