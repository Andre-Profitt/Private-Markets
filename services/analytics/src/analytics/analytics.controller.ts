import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateMetricDto, CreateReportDto } from './dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('metrics')
  @ApiOperation({ summary: 'Record metric' })
  recordMetric(@Body() data: CreateMetricDto) {
    return this.analyticsService.recordMetric(data);
  }

  @Get('metrics/:name')
  @ApiOperation({ summary: 'Get metrics by name' })
  getMetrics(
    @Param('name') name: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getMetrics(
      name,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post('reports')
  @ApiOperation({ summary: 'Create report' })
  createReport(@Body() data: CreateReportDto) {
    return this.analyticsService.createReport(data);
  }

  @Post('reports/:id/execute')
  @ApiOperation({ summary: 'Execute report' })
  executeReport(@Param('id') id: string) {
    return this.analyticsService.executeReport(id);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }
}
