import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export enum ValuationType {
  FUNDRAISE = 'FUNDRAISE',
  VALUATION_409A = 'VALUATION_409A',
  SECONDARY_SALE = 'SECONDARY_SALE',
  ACQUISITION_OFFER = 'ACQUISITION_OFFER',
  MARKET_ESTIMATE = 'MARKET_ESTIMATE',
  INTERNAL = 'INTERNAL',
  OTHER = 'OTHER',
}

export class CreateValuationDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: '2024-03-15' })
  @IsDateString()
  valuationDate: string;

  @ApiProperty({ example: 12.50 })
  @IsNumber()
  @Min(0)
  pricePerShare: number;

  @ApiProperty({ example: 125000000 })
  @IsNumber()
  @Min(0)
  totalValuation: number;

  @ApiProperty({ enum: ValuationType, example: ValuationType.FUNDRAISE })
  @IsEnum(ValuationType)
  valuationType: ValuationType;

  @ApiPropertyOptional({ example: 'Series B Fundraise - $25M at $125M post-money' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ example: 'Independent 409A valuation by Acme Valuation LLC' })
  @IsOptional()
  @IsString()
  notes?: string;
}
