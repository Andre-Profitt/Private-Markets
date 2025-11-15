import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MockKycProvider } from './providers/mock-kyc.provider';
import { InitiateKycDto, UpdateKycDto } from './dto';

@Injectable()
export class KycService {
  constructor(
    private prisma: PrismaService,
    private mockProvider: MockKycProvider,
  ) {}

  async initiateCheck(userId: string, initiateKycDto: InitiateKycDto) {
    // Get user profile
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found. Please create a profile first.');
    }

    // Create pending KYC check
    const kycCheck = await this.prisma.kycCheck.create({
      data: {
        profileId: profile.id,
        provider: initiateKycDto.provider || 'MOCK',
        checkType: initiateKycDto.checkType as any,
        status: 'PENDING',
      },
    });

    // Perform the check asynchronously
    this.performCheck(kycCheck.id, initiateKycDto.checkType, profile).catch(err => {
      console.error('KYC check failed:', err);
    });

    return kycCheck;
  }

  private async performCheck(checkId: string, checkType: string, profile: any) {
    let result;

    switch (checkType) {
      case 'IDENTITY_VERIFICATION':
        result = await this.mockProvider.verifyIdentity(profile);
        break;
      case 'ADDRESS_VERIFICATION':
        result = await this.mockProvider.verifyAddress(profile);
        break;
      case 'SANCTIONS_SCREENING':
        result = await this.mockProvider.screenSanctions(profile);
        break;
      case 'PEP_SCREENING':
        result = await this.mockProvider.screenPEP(profile);
        break;
      default:
        throw new BadRequestException('Invalid check type');
    }

    // Update KYC check with results
    await this.prisma.kycCheck.update({
      where: { id: checkId },
      data: {
        status: result.status as any,
        referenceId: result.referenceId,
        riskScore: result.riskScore,
        result: result.result,
        verifiedAt: result.status === 'APPROVED' ? new Date() : null,
      },
    });
  }

  async getChecksByUserId(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.kycCheck.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCheck(id: string) {
    const check = await this.prisma.kycCheck.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!check) {
      throw new NotFoundException('KYC check not found');
    }

    return check;
  }

  async updateCheck(id: string, updateKycDto: UpdateKycDto) {
    const check = await this.prisma.kycCheck.update({
      where: { id },
      data: {
        status: updateKycDto.status as any,
        riskScore: updateKycDto.riskScore,
        notes: updateKycDto.notes,
        verifiedAt: updateKycDto.status === 'APPROVED' ? new Date() : null,
      },
    });

    return check;
  }

  async getKycStatus(userId: string) {
    const checks = await this.getChecksByUserId(userId);

    const latestChecks = {
      identity: checks.find(c => c.checkType === 'IDENTITY_VERIFICATION'),
      address: checks.find(c => c.checkType === 'ADDRESS_VERIFICATION'),
      sanctions: checks.find(c => c.checkType === 'SANCTIONS_SCREENING'),
      pep: checks.find(c => c.checkType === 'PEP_SCREENING'),
    };

    const allApproved = Object.values(latestChecks).every(
      check => check && check.status === 'APPROVED'
    );

    return {
      overall: allApproved ? 'APPROVED' : 'INCOMPLETE',
      checks: latestChecks,
      totalChecks: checks.length,
    };
  }
}
