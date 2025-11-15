import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { InitiateKycDto, UpdateKycDto } from './dto';

@ApiTags('KYC')
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('user/:userId/start')
  @ApiOperation({ summary: 'Initiate KYC check' })
  @ApiResponse({ status: 201, description: 'KYC check initiated' })
  async initiateCheck(
    @Param('userId') userId: string,
    @Body() initiateKycDto: InitiateKycDto,
  ) {
    return this.kycService.initiateCheck(userId, initiateKycDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all KYC checks for user' })
  async getChecksByUserId(@Param('userId') userId: string) {
    return this.kycService.getChecksByUserId(userId);
  }

  @Get('user/:userId/status')
  @ApiOperation({ summary: 'Get overall KYC status' })
  async getKycStatus(@Param('userId') userId: string) {
    return this.kycService.getKycStatus(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get KYC check by ID' })
  async getCheck(@Param('id') id: string) {
    return this.kycService.getCheck(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update KYC check (admin/compliance)' })
  async updateCheck(@Param('id') id: string, @Body() updateKycDto: UpdateKycDto) {
    return this.kycService.updateCheck(id, updateKycDto);
  }
}
