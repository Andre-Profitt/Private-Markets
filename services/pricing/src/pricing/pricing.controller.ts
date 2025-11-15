import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PricingService } from './pricing.service';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('price')
  @ApiOperation({ summary: 'Record security price' })
  recordPrice(@Body() data: any) {
    return this.pricingService.recordPrice(data);
  }

  @Get('price/:companyId/:securityClassId/latest')
  @ApiOperation({ summary: 'Get latest price' })
  getLatestPrice(
    @Param('companyId') companyId: string,
    @Param('securityClassId') securityClassId: string,
  ) {
    return this.pricingService.getLatestPrice(companyId, securityClassId);
  }

  @Get('price/:companyId/:securityClassId/history')
  @ApiOperation({ summary: 'Get price history' })
  getPriceHistory(
    @Param('companyId') companyId: string,
    @Param('securityClassId') securityClassId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.pricingService.getPriceHistory(
      companyId,
      securityClassId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post('valuation')
  @ApiOperation({ summary: 'Calculate valuation' })
  calculateValuation(@Body() data: any) {
    return this.pricingService.calculateValuation(
      data.companyId,
      data.securityClassId,
      data.modelType,
      data.parameters,
    );
  }

  @Post('fair-value')
  @ApiOperation({ summary: 'Record fair value measurement' })
  recordFairValue(@Body() data: any) {
    return this.pricingService.recordFairValue(data);
  }
}
