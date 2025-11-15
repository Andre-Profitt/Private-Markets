import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DealsService } from './deals.service';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create deal' })
  createDeal(@Body() data: any) {
    return this.dealsService.createDeal(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  getDeals() {
    return this.dealsService.getDeals();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID' })
  getDeal(@Param('id') id: string) {
    return this.dealsService.getDeal(id);
  }

  @Post(':id/invest')
  @ApiOperation({ summary: 'Invest in deal' })
  invest(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    return this.dealsService.invest(id, userId, amount);
  }
}
