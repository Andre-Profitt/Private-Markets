import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create user profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  async create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get profile by user ID' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  async findByUserId(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by ID' })
  async findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Put('user/:userId')
  @ApiOperation({ summary: 'Update profile' })
  async update(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(userId, updateProfileDto);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Delete profile' })
  async delete(@Param('userId') userId: string) {
    return this.profilesService.delete(userId);
  }

  @Get('user/:userId/completion')
  @ApiOperation({ summary: 'Get profile completion status' })
  async getCompletion(@Param('userId') userId: string) {
    return this.profilesService.getProfileCompletion(userId);
  }
}
