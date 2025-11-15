import { Module } from '@nestjs/common';
import { HoldingsService } from './holdings.service';
import {
  HoldingsController,
  TransactionsController,
  PositionsController,
  PortfolioController,
  TransfersController,
} from './holdings.controller';

@Module({
  controllers: [
    HoldingsController,
    TransactionsController,
    PositionsController,
    PortfolioController,
    TransfersController,
  ],
  providers: [HoldingsService],
  exports: [HoldingsService],
})
export class HoldingsModule {}
