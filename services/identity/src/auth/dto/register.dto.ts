import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType, InvestorType } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ enum: UserType, example: UserType.BUYER })
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'United States', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  // Seller-specific
  @ApiProperty({ example: 'Acme Corp', required: false, description: 'Company name for sellers' })
  @IsString()
  @IsOptional()
  company?: string;

  // Buyer-specific
  @ApiProperty({ enum: InvestorType, required: false, description: 'Investor type for buyers' })
  @IsEnum(InvestorType)
  @IsOptional()
  investorType?: InvestorType;
}
