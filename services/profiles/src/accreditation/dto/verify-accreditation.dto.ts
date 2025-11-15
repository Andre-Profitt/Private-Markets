import { IsEnum, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccreditationDto {
  @ApiProperty({ enum: ['INCOME_TEST', 'NET_WORTH_TEST', 'PROFESSIONAL_CREDENTIAL', 'QUALIFIED_PURCHASER'] })
  @IsEnum(['INCOME_TEST', 'NET_WORTH_TEST', 'PROFESSIONAL_CREDENTIAL', 'QUALIFIED_PURCHASER'])
  verificationType: string;

  @ApiProperty({ required: false, example: 250000 })
  @IsNumber()
  @IsOptional()
  annualIncome?: number;

  @ApiProperty({ required: false, example: 1500000 })
  @IsNumber()
  @IsOptional()
  netWorth?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isQualifiedPurchaser?: boolean;

  @ApiProperty({ required: false, example: ['Series 7', 'Series 65'] })
  @IsArray()
  @IsOptional()
  licenses?: string[];
}
