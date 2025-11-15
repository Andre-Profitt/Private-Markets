import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    // Check if profile already exists for this user
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId: createProfileDto.userId },
    });

    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }

    const profile = await this.prisma.userProfile.create({
      data: {
        ...createProfileDto,
        dateOfBirth: createProfileDto.dateOfBirth 
          ? new Date(createProfileDto.dateOfBirth) 
          : undefined,
      },
      include: {
        kycChecks: true,
        accreditation: true,
      },
    });

    return profile;
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        kycChecks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        accreditation: true,
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async findOne(id: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id },
      include: {
        kycChecks: {
          orderBy: { createdAt: 'desc' },
        },
        accreditation: true,
        documents: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.userProfile.update({
      where: { userId },
      data: {
        ...updateProfileDto,
        dateOfBirth: updateProfileDto.dateOfBirth 
          ? new Date(updateProfileDto.dateOfBirth) 
          : undefined,
        profileComplete: this.checkProfileComplete(updateProfileDto),
      },
      include: {
        kycChecks: true,
        accreditation: true,
      },
    });

    return profile;
  }

  async delete(userId: string) {
    await this.prisma.userProfile.delete({
      where: { userId },
    });
  }

  private checkProfileComplete(profile: any): boolean {
    // Check if essential fields are filled
    return !!(
      profile.dateOfBirth &&
      profile.phoneNumber &&
      profile.street &&
      profile.city &&
      profile.state &&
      profile.zipCode &&
      profile.country
    );
  }

  async getProfileCompletion(userId: string) {
    const profile = await this.findByUserId(userId);
    
    const requiredFields = [
      'dateOfBirth',
      'phoneNumber',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
    ];

    const completedFields = requiredFields.filter(field => profile[field]);
    const completionPercentage = Math.round(
      (completedFields.length / requiredFields.length) * 100
    );

    return {
      completionPercentage,
      completedFields: completedFields.length,
      totalFields: requiredFields.length,
      missingFields: requiredFields.filter(field => !profile[field]),
    };
  }
}
