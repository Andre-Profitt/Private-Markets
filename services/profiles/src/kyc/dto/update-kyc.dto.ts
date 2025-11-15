import { IsString, IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateKycDto {
  @ApiProperty({ enum: ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED'] })
  @IsEnum(['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED'])
  status: string;

  @ApiProperty({ required: false, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  riskScore?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
