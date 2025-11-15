import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { MockKycProvider } from './providers/mock-kyc.provider';

@Module({
  controllers: [KycController],
  providers: [KycService, MockKycProvider],
  exports: [KycService],
})
export class KycModule {}
