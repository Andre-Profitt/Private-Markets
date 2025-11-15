import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateSecurityClassDto } from './dto/create-security-class.dto';
import { CreateValuationDto } from './dto/create-valuation.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  // ====================
  // Company Management
  // ====================

  async createCompany(createCompanyDto: CreateCompanyDto) {
    // Check if company with EIN already exists
    if (createCompanyDto.ein) {
      const existing = await this.prisma.company.findUnique({
        where: { ein: createCompanyDto.ein },
      });
      if (existing) {
        throw new ConflictException('Company with this EIN already exists');
      }
    }

    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        incorporationDate: createCompanyDto.incorporationDate 
          ? new Date(createCompanyDto.incorporationDate) 
          : undefined,
      },
      include: {
        securityClasses: true,
        valuations: {
          orderBy: { valuationDate: 'desc' },
          take: 1,
        },
      },
    });

    await this.createAuditLog('Company', company.id, 'CREATE', null);

    return company;
  }

  async findAllCompanies(params?: {
    skip?: number;
    take?: number;
    status?: string;
    industry?: string;
    businessType?: string;
  }) {
    const { skip = 0, take = 20, status, industry, businessType } = params || {};

    const where: any = {};
    if (status) where.status = status;
    if (industry) where.industry = industry;
    if (businessType) where.businessType = businessType;

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take,
        include: {
          securityClasses: {
            select: {
              id: true,
              name: true,
              classType: true,
              authorizedShares: true,
              outstandingShares: true,
            },
          },
          valuations: {
            orderBy: { valuationDate: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findCompanyById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        securityClasses: {
          include: {
            instruments: {
              where: { status: 'ACTIVE' },
              select: {
                id: true,
                holderUserId: true,
                sharesOwned: true,
                status: true,
              },
            },
          },
        },
        valuations: {
          orderBy: { valuationDate: 'desc' },
          take: 5,
        },
        corporateActions: {
          orderBy: { effectiveDate: 'desc' },
          take: 10,
        },
        contacts: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findCompanyById(id); // Verify exists

    const company = await this.prisma.company.update({
      where: { id },
      data: {
        ...updateCompanyDto,
        incorporationDate: updateCompanyDto.incorporationDate 
          ? new Date(updateCompanyDto.incorporationDate) 
          : undefined,
      },
      include: {
        securityClasses: true,
        valuations: {
          orderBy: { valuationDate: 'desc' },
          take: 1,
        },
      },
    });

    await this.createAuditLog('Company', id, 'UPDATE', null);

    return company;
  }

  async deleteCompany(id: string) {
    await this.findCompanyById(id); // Verify exists

    // Check if company has any active security instruments
    const activeInstruments = await this.prisma.securityInstrument.count({
      where: {
        securityClass: { companyId: id },
        status: 'ACTIVE',
      },
    });

    if (activeInstruments > 0) {
      throw new BadRequestException(
        'Cannot delete company with active security instruments. Transfer or cancel instruments first.',
      );
    }

    await this.prisma.company.delete({ where: { id } });
    await this.createAuditLog('Company', id, 'DELETE', null);

    return { message: 'Company deleted successfully' };
  }

  // ====================
  // Security Class Management
  // ====================

  async createSecurityClass(createSecurityClassDto: CreateSecurityClassDto) {
    // Verify company exists
    const company = await this.findCompanyById(createSecurityClassDto.companyId);

    // Check for duplicate class name
    const existing = await this.prisma.securityClass.findFirst({
      where: {
        companyId: createSecurityClassDto.companyId,
        name: createSecurityClassDto.name,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Security class "${createSecurityClassDto.name}" already exists for this company`,
      );
    }

    const securityClass = await this.prisma.securityClass.create({
      data: {
        ...createSecurityClassDto,
        issuanceDate: createSecurityClassDto.issuanceDate 
          ? new Date(createSecurityClassDto.issuanceDate) 
          : undefined,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            legalName: true,
          },
        },
      },
    });

    await this.createAuditLog('SecurityClass', securityClass.id, 'CREATE', null);

    return securityClass;
  }

  async findSecurityClassesByCompany(companyId: string) {
    await this.findCompanyById(companyId); // Verify company exists

    return this.prisma.securityClass.findMany({
      where: { companyId },
      include: {
        instruments: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            holderUserId: true,
            sharesOwned: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSecurityClassById(id: string) {
    const securityClass = await this.prisma.securityClass.findUnique({
      where: { id },
      include: {
        company: true,
        instruments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!securityClass) {
      throw new NotFoundException(`Security class with ID ${id} not found`);
    }

    return securityClass;
  }

  async updateSecurityClass(id: string, updateData: Partial<CreateSecurityClassDto>) {
    await this.findSecurityClassById(id); // Verify exists

    const securityClass = await this.prisma.securityClass.update({
      where: { id },
      data: {
        ...updateData,
        issuanceDate: updateData.issuanceDate 
          ? new Date(updateData.issuanceDate) 
          : undefined,
      },
      include: {
        company: true,
      },
    });

    await this.createAuditLog('SecurityClass', id, 'UPDATE', null);

    return securityClass;
  }

  // ====================
  // Valuation Management
  // ====================

  async createValuation(createValuationDto: CreateValuationDto) {
    await this.findCompanyById(createValuationDto.companyId); // Verify company exists

    const valuation = await this.prisma.companyValuation.create({
      data: {
        ...createValuationDto,
        valuationDate: new Date(createValuationDto.valuationDate),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await this.createAuditLog('CompanyValuation', valuation.id, 'CREATE', null);

    return valuation;
  }

  async findValuationsByCompany(companyId: string, limit = 10) {
    await this.findCompanyById(companyId); // Verify company exists

    return this.prisma.companyValuation.findMany({
      where: { companyId },
      orderBy: { valuationDate: 'desc' },
      take: limit,
    });
  }

  async getLatestValuation(companyId: string) {
    await this.findCompanyById(companyId); // Verify company exists

    const valuation = await this.prisma.companyValuation.findFirst({
      where: { companyId },
      orderBy: { valuationDate: 'desc' },
    });

    if (!valuation) {
      throw new NotFoundException(`No valuations found for company ${companyId}`);
    }

    return valuation;
  }

  // ====================
  // Analytics & Reports
  // ====================

  async getCompanyCapTable(companyId: string) {
    await this.findCompanyById(companyId); // Verify company exists

    const securityClasses = await this.prisma.securityClass.findMany({
      where: { companyId },
      include: {
        instruments: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    // Aggregate holdings by security class
    const capTable = securityClasses.map((secClass) => {
      const totalShares = secClass.instruments.reduce(
        (sum, inst) => sum + Number(inst.sharesOwned),
        0,
      );

      const holders = secClass.instruments.reduce((acc, inst) => {
        const holderId = inst.holderUserId || inst.holderName || 'Unknown';
        if (!acc[holderId]) {
          acc[holderId] = {
            holderId: inst.holderUserId,
            holderName: inst.holderName,
            shares: 0,
            instruments: [],
          };
        }
        acc[holderId].shares += Number(inst.sharesOwned);
        acc[holderId].instruments.push({
          id: inst.id,
          shares: Number(inst.sharesOwned),
          certificateNumber: inst.certificateNumber,
        });
        return acc;
      }, {});

      return {
        securityClass: {
          id: secClass.id,
          name: secClass.name,
          classType: secClass.classType,
          authorizedShares: Number(secClass.authorizedShares),
          outstandingShares: Number(secClass.outstandingShares),
        },
        totalActiveShares: totalShares,
        holders: Object.values(holders),
        utilizationPercentage: 
          (totalShares / Number(secClass.authorizedShares)) * 100,
      };
    });

    return {
      companyId,
      asOf: new Date(),
      securityClasses: capTable,
    };
  }

  async getCompanyStats(companyId: string) {
    await this.findCompanyById(companyId); // Verify company exists

    const [
      totalSecurityClasses,
      totalActiveInstruments,
      latestValuation,
      recentCorporateActions,
    ] = await Promise.all([
      this.prisma.securityClass.count({ where: { companyId } }),
      this.prisma.securityInstrument.count({
        where: {
          securityClass: { companyId },
          status: 'ACTIVE',
        },
      }),
      this.prisma.companyValuation.findFirst({
        where: { companyId },
        orderBy: { valuationDate: 'desc' },
      }),
      this.prisma.corporateAction.count({
        where: {
          companyId,
          effectiveDate: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      totalSecurityClasses,
      totalActiveInstruments,
      latestValuation: latestValuation ? {
        valuationDate: latestValuation.valuationDate,
        totalValuation: Number(latestValuation.totalValuation),
        pricePerShare: Number(latestValuation.pricePerShare),
        valuationType: latestValuation.valuationType,
      } : null,
      corporateActionsLast12Months: recentCorporateActions,
    };
  }

  // ====================
  // Audit Logging
  // ====================

  private async createAuditLog(
    entityType: string,
    entityId: string,
    action: string,
    userId: string | null,
    changes?: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        action,
        userId,
        changes,
      },
    });
  }
}
