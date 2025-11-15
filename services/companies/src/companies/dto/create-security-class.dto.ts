import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';

export enum SecurityClassType {
  COMMON_STOCK = 'COMMON_STOCK',
  PREFERRED_STOCK = 'PREFERRED_STOCK',
  CONVERTIBLE_NOTE = 'CONVERTIBLE_NOTE',
  SAFE = 'SAFE',
  WARRANT = 'WARRANT',
  OPTION = 'OPTION',
  UNITS = 'UNITS',
  OTHER = 'OTHER',
}

export class CreateSecurityClassDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'Series A Preferred Stock' })
  @IsString()
  name: string;

  @ApiProperty({ enum: SecurityClassType, example: SecurityClassType.PREFERRED_STOCK })
  @IsEnum(SecurityClassType)
  classType: SecurityClassType;

  @ApiPropertyOptional({ example: 0.0001 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  parValue?: number;

  @ApiProperty({ example: 10000000 })
  @IsNumber()
  @Min(0)
  authorizedShares: number;

  @ApiPropertyOptional({ example: 1.0, description: 'Liquidation preference multiple (e.g., 1.0x, 1.5x)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  liquidationPreference?: number;

  @ApiPropertyOptional({ example: 0.08, description: 'Annual dividend rate as decimal (e.g., 0.08 = 8%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dividendRate?: number;

  @ApiPropertyOptional({ example: 1.0, description: 'Conversion ratio to common stock' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  conversionRatio?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  votingRights?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  participatingRights?: boolean;

  @ApiPropertyOptional({ example: '2022-06-15' })
  @IsOptional()
  @IsDateString()
  issuanceDate?: string;

  @ApiPropertyOptional({ example: 'Series A Preferred Stock with 1x liquidation preference' })
  @IsOptional()
  @IsString()
  description?: string;
}
