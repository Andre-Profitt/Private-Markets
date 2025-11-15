import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetricDto {
  @ApiProperty({ example: 'trading_volume', description: 'Metric name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'marketplace', description: 'Metric category' })
  @IsString()
  category: string;

  @ApiProperty({ example: 1500000, description: 'Metric value' })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 'USD', description: 'Unit of measurement', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: { region: 'US' }, description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
