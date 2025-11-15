import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsUrl } from 'class-validator';

export enum BusinessType {
  C_CORP = 'C_CORP',
  S_CORP = 'S_CORP',
  LLC = 'LLC',
  PARTNERSHIP = 'PARTNERSHIP',
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  NON_PROFIT = 'NON_PROFIT',
  OTHER = 'OTHER',
}

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Technologies Inc.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Acme Technologies Incorporated' })
  @IsString()
  legalName: string;

  @ApiPropertyOptional({ example: '12-3456789' })
  @IsOptional()
  @IsString()
  ein?: string;

  @ApiPropertyOptional({ example: '2020-01-15' })
  @IsOptional()
  @IsDateString()
  incorporationDate?: string;

  @ApiPropertyOptional({ example: 'Delaware' })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiProperty({ enum: BusinessType, example: BusinessType.C_CORP })
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @ApiPropertyOptional({ example: 'Technology' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: 'Software & Services' })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({ example: 'Leading provider of cloud-based SaaS solutions...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://acme.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: 'https://cdn.acme.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '123 Innovation Drive' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: 'San Francisco' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'CA' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '94105' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ example: 'US', default: 'US' })
  @IsOptional()
  @IsString()
  country?: string;
}
