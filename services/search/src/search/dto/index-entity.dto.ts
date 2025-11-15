import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IndexEntityDto {
  @ApiProperty({ example: 'company', description: 'Type of entity' })
  @IsString()
  entityType: string;

  @ApiProperty({ example: 'comp-123', description: 'Entity ID' })
  @IsString()
  entityId: string;

  @ApiProperty({ example: 'Acme Corp', description: 'Entity title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Leading technology company', description: 'Entity description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Full content to be indexed', description: 'Full text content' })
  @IsString()
  content: string;

  @ApiProperty({ example: ['technology', 'saas'], description: 'Tags', required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'software', description: 'Category', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: { industry: 'Technology' }, description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
