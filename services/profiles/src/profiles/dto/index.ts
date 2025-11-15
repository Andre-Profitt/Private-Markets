import { IsString, IsOptional, IsDateString, IsBoolean, IsEnum, IsNumber, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

// Enum imports from Prisma
enum KycCheckType {
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  ADDRESS_VERIFICATION = 'ADDRESS_VERIFICATION',
  SANCTIONS_SCREENING = 'SANCTIONS_SCREENING',
  PEP_SCREENING = 'PEP_SCREENING',
  ADVERSE_MEDIA_SCREENING = 'ADVERSE_MEDIA_SCREENING'
}

enum KycStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  REQUIRES_RESUBMISSION = 'REQUIRES_RESUBMISSION'
}

enum AccreditationStatusType {
  NOT_VERIFIED = 'NOT_VERIFIED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

enum AccreditationType {
  INCOME_TEST = 'INCOME_TEST',
  NET_WORTH_TEST = 'NET_WORTH_TEST',
  PROFESSIONAL_CREDENTIAL = 'PROFESSIONAL_CREDENTIAL',
  ENTITY_OWNED = 'ENTITY_OWNED',
  QUALIFIED_PURCHASER = 'QUALIFIED_PURCHASER'
}

enum DocumentType {
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  NATIONAL_ID = 'NATIONAL_ID',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  BANK_STATEMENT = 'BANK_STATEMENT',
  TAX_RETURN = 'TAX_RETURN',
  W2 = 'W2',
  INVESTMENT_ACCOUNT_STATEMENT = 'INVESTMENT_ACCOUNT_STATEMENT',
  PROFESSIONAL_LICENSE = 'PROFESSIONAL_LICENSE',
  OTHER = 'OTHER'
}

// Address DTO
class AddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;
}

// Create Profile DTO
export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  profileComplete?: boolean;
}

// Update Profile DTO
export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  profileComplete?: boolean;
}

// KYC Check DTOs
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

export class UpdateKycCheckDto extends PartialType(CreateKycCheckDto) {}

// Accreditation DTOs
export class CreateAccreditationDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  profileId: string;

  @ApiProperty({ enum: AccreditationStatusType, default: AccreditationStatusType.NOT_VERIFIED })
  @IsEnum(AccreditationStatusType)
  status: AccreditationStatusType;

  @ApiPropertyOptional({ enum: AccreditationType })
  @IsOptional()
  @IsEnum(AccreditationType)
  verificationType?: AccreditationType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  annualIncome?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  netWorth?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isQualifiedPurchaser?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  licenses?: string[];

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastReviewedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAccreditationDto extends PartialType(CreateAccreditationDto) {}

// Document DTOs
export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  profileId: string;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty()
  @IsNumber()
  fileSize: number;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

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

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}