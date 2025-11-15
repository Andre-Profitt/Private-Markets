import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController, SecurityClassesController, ValuationsController } from './companies.controller';

@Module({
  controllers: [CompaniesController, SecurityClassesController, ValuationsController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
