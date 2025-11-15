import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map(user => ({
        ...user,
        roles: user.roles.map(ur => ur.role),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        emailVerified: true,
        mfaEnabled: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      roles: user.roles.map(ur => ur.role),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserRoles(userId: string) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

    return userRoles.map(ur => ur.role);
  }

  async assignRole(userId: string, roleId: string) {
    const existingAssignment = await this.prisma.userRole.findFirst({
      where: { userId, roleId },
    });

    if (existingAssignment) {
      return { message: 'Role already assigned' };
    }

    await this.prisma.userRole.create({
      data: { userId, roleId },
    });

    return { message: 'Role assigned successfully' };
  }

  async removeRole(userId: string, roleId: string) {
    await this.prisma.userRole.deleteMany({
      where: { userId, roleId },
    });

    return { message: 'Role removed successfully' };
  }
}
