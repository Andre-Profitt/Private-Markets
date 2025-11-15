import { Module } from '@nestjs/common';
import { AccreditationService } from './accreditation.service';
import { AccreditationController } from './accreditation.controller';

@Module({
  controllers: [AccreditationController],
  providers: [AccreditationService],
  exports: [AccreditationService],
})
export class AccreditationModule {}
