import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';

export enum AcquisitionMethod {
  PURCHASE = 'PURCHASE',
  GRANT = 'GRANT',
  EXERCISE = 'EXERCISE',
  TRANSFER = 'TRANSFER',
  CONVERSION = 'CONVERSION',
  DIVIDEND = 'DIVIDEND',
  OTHER = 'OTHER',
}

export class CreateHoldingDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'company-uuid' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'security-class-uuid' })
  @IsString()
  securityClassId: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  sharesOwned: number;

  @ApiPropertyOptional({ example: 10.50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costBasis?: number;

  @ApiPropertyOptional({ example: 10500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCost?: number;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  acquisitionDate: string;

  @ApiProperty({ enum: AcquisitionMethod, example: AcquisitionMethod.PURCHASE })
  @IsEnum(AcquisitionMethod)
  acquisitionMethod: AcquisitionMethod;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isRestricted?: boolean;

  @ApiPropertyOptional({ example: '2025-01-15' })
  @IsOptional()
  @IsDateString()
  restrictionEndDate?: string;

  @ApiPropertyOptional({ example: 'Shares purchased in Series B round' })
  @IsOptional()
  @IsString()
  notes?: string;
}
