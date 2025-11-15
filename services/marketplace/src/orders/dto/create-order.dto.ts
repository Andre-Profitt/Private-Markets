import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP_LIMIT = 'STOP_LIMIT',
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class CreateOrderDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'company-uuid' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'security-class-uuid' })
  @IsString()
  securityClassId: string;

  @ApiProperty({ enum: OrderType, example: OrderType.LIMIT })
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({ enum: OrderSide, example: OrderSide.BUY })
  @IsEnum(OrderSide)
  side: OrderSide;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 12.50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'Buy order for investment' })
  @IsOptional()
  @IsString()
  notes?: string;
}
