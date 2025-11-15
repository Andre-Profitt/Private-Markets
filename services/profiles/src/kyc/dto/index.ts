import { IsString, IsOptional, IsDateString, IsBoolean, IsEnum, IsNumber, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

// Enum imports from Prisma
export enum KycCheckType {
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  ADDRESS_VERIFICATION = 'ADDRESS_VERIFICATION',
  SANCTIONS_SCREENING = 'SANCTIONS_SCREENING',
  PEP_SCREENING = 'PEP_SCREENING',
  ADVERSE_MEDIA_SCREENING = 'ADVERSE_MEDIA_SCREENING'
}

export enum KycStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  REQUIRES_RESUBMISSION = 'REQUIRES_RESUBMISSION'
}

// Initiate KYC DTO
export class InitiateKycDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  profileId: string;

  @ApiProperty({ enum: KycCheckType })
  @IsEnum(KycCheckType)
  checkType: KycCheckType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// Update KYC DTO
export class UpdateKycDto {
  @ApiPropertyOptional({ enum: KycStatus })
  @IsOptional()
  @IsEnum(KycStatus)
  status?: KycStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  result?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  verifiedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  verifiedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}

// Create KYC Check DTO (for internal use)
export class CreateKycCheckDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  profileId: string;

  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty({ enum: KycCheckType })
  @IsEnum(KycCheckType)
  checkType: KycCheckType;

  @ApiProperty({ enum: KycStatus })
  @IsEnum(KycStatus)
  status: KycStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  result?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  verifiedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  verifiedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}

// Verify KYC DTO
export class VerifyKycDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  checkId: string;

  @ApiProperty({ enum: KycStatus })
  @IsEnum(KycStatus)
  status: KycStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  result?: any;
}

// KYC Summary DTO (for responses)
export class KycSummaryDto {
  @ApiProperty()
  profileId: string;

  @ApiProperty()
  overallStatus: string;

  @ApiProperty()
  identityVerified: boolean;

  @ApiProperty()
  documentVerified: boolean;

  @ApiProperty()
  addressVerified: boolean;

  @ApiProperty()
  sanctionsCleared: boolean;

  @ApiProperty()
  pepCleared: boolean;

  @ApiProperty()
  adverseMediaCleared: boolean;

  @ApiPropertyOptional()
  lastCheckDate?: Date;

  @ApiPropertyOptional()
  nextReviewDate?: Date;

  @ApiPropertyOptional()
  riskLevel?: string;
}