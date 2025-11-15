import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordMetric(data: {
    name: string;
    category: string;
    value: number;
    unit?: string;
    dimensions?: any;
  }) {
    return this.prisma.metric.create({ data });
  }

  async getMetrics(name: string, startDate?: Date, endDate?: Date) {
    return this.prisma.metric.findMany({
      where: {
        name,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async createReport(data: {
    name: string;
    reportType: string;
    parameters?: any;
    createdBy: string;
  }) {
    return this.prisma.report.create({
      data: {
        ...data,
        parameters: data.parameters || {},
        reportType: data.reportType as any,
      },
    });
  }

  async executeReport(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    const execution = await this.prisma.reportExecution.create({
      data: {
        reportId,
        status: 'RUNNING',
      },
    });

    try {
      const result = await this.generateReportData(report);

      return await this.prisma.reportExecution.update({
        where: { id: execution.id },
        data: {
          status: 'COMPLETED',
          result,
          completedAt: new Date(),
        },
      });
    } catch (error) {
      return await this.prisma.reportExecution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          error: error.message,
          completedAt: new Date(),
        },
      });
    }
  }

  private async generateReportData(report: any) {
    // Simplified report generation
    return {
      reportType: report.reportType,
      generatedAt: new Date(),
      data: {
        summary: 'Report generated successfully',
        parameters: report.parameters,
      },
    };
  }

  async getDashboardMetrics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeDeals, totalVolume] = await Promise.all([
      this.prisma.metric.findFirst({
        where: { name: 'total_users', timestamp: { gte: thirtyDaysAgo } },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.metric.findFirst({
        where: { name: 'active_deals', timestamp: { gte: thirtyDaysAgo } },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.metric.findFirst({
        where: { name: 'trading_volume', timestamp: { gte: thirtyDaysAgo } },
        orderBy: { timestamp: 'desc' },
      }),
    ]);

    return {
      totalUsers: Number(totalUsers?.value || 0),
      activeDeals: Number(activeDeals?.value || 0),
      totalVolume: Number(totalVolume?.value || 0),
    };
  }
}
