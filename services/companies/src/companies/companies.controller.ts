import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateSecurityClassDto } from './dto/create-security-class.dto';
import { CreateValuationDto } from './dto/create-valuation.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // ====================
  // Company Endpoints
  // ====================

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiResponse({ status: 409, description: 'Company with EIN already exists' })
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies with pagination and filters' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'industry', required: false, type: String })
  @ApiQuery({ name: 'businessType', required: false, type: String })
  findAllCompanies(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('industry') industry?: string,
    @Query('businessType') businessType?: string,
  ) {
    return this.companiesService.findAllCompanies({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      industry,
      businessType,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company found' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findCompanyById(@Param('id') id: string) {
    return this.companiesService.findCompanyById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update company' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete company' })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete company with active instruments' })
  deleteCompany(@Param('id') id: string) {
    return this.companiesService.deleteCompany(id);
  }

  // ====================
  // Analytics Endpoints
  // ====================

  @Get(':id/cap-table')
  @ApiOperation({ summary: 'Get company capitalization table' })
  @ApiResponse({ status: 200, description: 'Cap table retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  getCapTable(@Param('id') id: string) {
    return this.companiesService.getCompanyCapTable(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get company statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  getCompanyStats(@Param('id') id: string) {
    return this.companiesService.getCompanyStats(id);
  }
}

@ApiTags('security-classes')
@Controller('security-classes')
export class SecurityClassesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new security class' })
  @ApiResponse({ status: 201, description: 'Security class created successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 409, description: 'Security class with this name already exists' })
  createSecurityClass(@Body() createSecurityClassDto: CreateSecurityClassDto) {
    return this.companiesService.createSecurityClass(createSecurityClassDto);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get all security classes for a company' })
  @ApiResponse({ status: 200, description: 'Security classes retrieved' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findByCompany(@Param('companyId') companyId: string) {
    return this.companiesService.findSecurityClassesByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get security class by ID' })
  @ApiResponse({ status: 200, description: 'Security class found' })
  @ApiResponse({ status: 404, description: 'Security class not found' })
  findSecurityClassById(@Param('id') id: string) {
    return this.companiesService.findSecurityClassById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update security class' })
  @ApiResponse({ status: 200, description: 'Security class updated successfully' })
  @ApiResponse({ status: 404, description: 'Security class not found' })
  updateSecurityClass(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateSecurityClassDto>,
  ) {
    return this.companiesService.updateSecurityClass(id, updateData);
  }
}

@ApiTags('valuations')
@Controller('valuations')
export class ValuationsController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company valuation' })
  @ApiResponse({ status: 201, description: 'Valuation created successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  createValuation(@Body() createValuationDto: CreateValuationDto) {
    return this.companiesService.createValuation(createValuationDto);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get valuation history for a company' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Valuations retrieved' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findByCompany(
    @Param('companyId') companyId: string,
    @Query('limit') limit?: string,
  ) {
    return this.companiesService.findValuationsByCompany(
      companyId,
      limit ? parseInt(limit) : undefined,
    );
  }

  @Get('company/:companyId/latest')
  @ApiOperation({ summary: 'Get latest valuation for a company' })
  @ApiResponse({ status: 200, description: 'Latest valuation retrieved' })
  @ApiResponse({ status: 404, description: 'Company or valuation not found' })
  getLatestValuation(@Param('companyId') companyId: string) {
    return this.companiesService.getLatestValuation(companyId);
  }
}
