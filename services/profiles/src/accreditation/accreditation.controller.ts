import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccreditationService } from './accreditation.service';
import { VerifyAccreditationDto } from './dto/verify-accreditation.dto';

@ApiTags('Accreditation')
@Controller('accreditation')
export class AccreditationController {
  constructor(private readonly accreditationService: AccreditationService) {}

  @Post('user/:userId/verify')
  @ApiOperation({ summary: 'Verify accreditation status' })
  @ApiResponse({ status: 201, description: 'Accreditation verified' })
  async verify(
    @Param('userId') userId: string,
    @Body() verifyDto: VerifyAccreditationDto,
  ) {
    return this.accreditationService.verify(userId, verifyDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get accreditation status' })
  async getStatus(@Param('userId') userId: string) {
    return this.accreditationService.getStatus(userId);
  }

  @Put('user/:userId/revoke')
  @ApiOperation({ summary: 'Revoke accreditation' })
  async revoke(
    @Param('userId') userId: string,
    @Body() body: { reason: string },
  ) {
    return this.accreditationService.revoke(userId, body.reason);
  }

  @Post('user/:userId/renew')
  @ApiOperation({ summary: 'Request accreditation renewal' })
  async requestRenewal(@Param('userId') userId: string) {
    return this.accreditationService.requestRenewal(userId);
  }
}
