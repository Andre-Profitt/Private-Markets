import { IsString, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReportType {
  PORTFOLIO_PERFORMANCE = 'PORTFOLIO_PERFORMANCE',
  TRANSACTION_SUMMARY = 'TRANSACTION_SUMMARY',
  KYC_COMPLIANCE = 'KYC_COMPLIANCE',
  DEAL_PIPELINE = 'DEAL_PIPELINE',
  REVENUE_ANALYSIS = 'REVENUE_ANALYSIS',
  USER_ACTIVITY = 'USER_ACTIVITY',
  MARKET_OVERVIEW = 'MARKET_OVERVIEW',
}

export class CreateReportDto {
  @ApiProperty({ example: 'Monthly Portfolio Performance', description: 'Report name' })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ReportType,
    example: ReportType.PORTFOLIO_PERFORMANCE,
    description: 'Type of report'
  })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({
    example: { period: 'month', userId: 'user-123' },
    description: 'Report parameters',
    required: false
  })
  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiProperty({ example: 'admin-id', description: 'User creating the report' })
  @IsString()
  createdBy: string;

  @ApiProperty({ example: '0 0 * * *', description: 'Cron schedule for automatic execution', required: false })
  @IsString()
  @IsOptional()
  schedule?: string;
}
