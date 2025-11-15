import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateKycDto {
  @ApiProperty({ example: 'IDENTITY_VERIFICATION' })
  @IsEnum(['IDENTITY_VERIFICATION', 'DOCUMENT_VERIFICATION', 'ADDRESS_VERIFICATION'])
  checkType: string;

  @ApiProperty({ example: 'MOCK', required: false })
  @IsString()
  provider?: string;
}
