import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { VerifyAccreditationDto } from './dto/verify-accreditation.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AccreditationService {
  constructor(private prisma: PrismaService) {}

  async verify(userId: string, verifyDto: VerifyAccreditationDto) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Validate based on verification type
    const isValid = this.validateAccreditation(verifyDto);

    if (!isValid) {
      throw new BadRequestException('Accreditation criteria not met');
    }

    // Calculate expiry (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Create or update accreditation status
    const accreditation = await this.prisma.accreditationStatus.upsert({
      where: { profileId: profile.id },
      update: {
        status: 'VERIFIED',
        verificationType: verifyDto.verificationType as any,
        annualIncome: verifyDto.annualIncome ? new Decimal(verifyDto.annualIncome) : null,
        netWorth: verifyDto.netWorth ? new Decimal(verifyDto.netWorth) : null,
        isQualifiedPurchaser: verifyDto.isQualifiedPurchaser || false,
        licenses: verifyDto.licenses || [],
        verifiedAt: new Date(),
        expiresAt,
      },
      create: {
        profileId: profile.id,
        status: 'VERIFIED',
        verificationType: verifyDto.verificationType as any,
        annualIncome: verifyDto.annualIncome ? new Decimal(verifyDto.annualIncome) : null,
        netWorth: verifyDto.netWorth ? new Decimal(verifyDto.netWorth) : null,
        isQualifiedPurchaser: verifyDto.isQualifiedPurchaser || false,
        licenses: verifyDto.licenses || [],
        verifiedAt: new Date(),
        expiresAt,
      },
    });

    return accreditation;
  }

  private validateAccreditation(verifyDto: VerifyAccreditationDto): boolean {
    switch (verifyDto.verificationType) {
      case 'INCOME_TEST':
        // $200k individual or $300k joint
        return verifyDto.annualIncome >= 200000;

      case 'NET_WORTH_TEST':
        // $1M net worth excluding primary residence
        return verifyDto.netWorth >= 1000000;

      case 'PROFESSIONAL_CREDENTIAL':
        // Must have valid licenses
        const validLicenses = ['Series 7', 'Series 65', 'Series 82'];
        return verifyDto.licenses?.some(license => 
          validLicenses.includes(license)
        ) || false;

      case 'QUALIFIED_PURCHASER':
        // $5M+ in investments
        return verifyDto.isQualifiedPurchaser === true;

      default:
        return false;
    }
  }

  async getStatus(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { accreditation: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (!profile.accreditation) {
      return {
        status: 'NOT_VERIFIED',
        message: 'No accreditation on file',
      };
    }

    // Check if expired
    if (profile.accreditation.expiresAt && 
        profile.accreditation.expiresAt < new Date()) {
      await this.prisma.accreditationStatus.update({
        where: { id: profile.accreditation.id },
        data: { status: 'EXPIRED' },
      });

      return {
        ...profile.accreditation,
        status: 'EXPIRED',
      };
    }

    return profile.accreditation;
  }

  async revoke(userId: string, reason: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const accreditation = await this.prisma.accreditationStatus.update({
      where: { profileId: profile.id },
      data: {
        status: 'REJECTED',
        notes: reason,
      },
    });

    return accreditation;
  }

  async requestRenewal(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { accreditation: true },
    });

    if (!profile || !profile.accreditation) {
      throw new NotFoundException('No accreditation found to renew');
    }

    const accreditation = await this.prisma.accreditationStatus.update({
      where: { id: profile.accreditation.id },
      data: {
        status: 'PENDING_VERIFICATION',
        lastReviewedAt: new Date(),
      },
    });

    return accreditation;
  }
}
