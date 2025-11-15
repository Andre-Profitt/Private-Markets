import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async seedDefaultRoles() {
    const roles = [
      { name: 'ADMIN', description: 'System administrator with full access' },
      { name: 'INVESTOR', description: 'Accredited investor' },
      { name: 'SELLER', description: 'Shareholder selling positions' },
      { name: 'COMPLIANCE', description: 'Compliance officer' },
      { name: 'OPS', description: 'Operations team member' },
    ];

    for (const role of roles) {
      await this.prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
    }

    return { message: 'Default roles seeded' };
  }
}
