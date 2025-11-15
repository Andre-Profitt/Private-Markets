import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HoldingsService } from './holdings.service';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('holdings')
@Controller('holdings')
export class HoldingsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new holding' })
  @ApiResponse({ status: 201, description: 'Holding created successfully' })
  createHolding(@Body() createHoldingDto: CreateHoldingDto) {
    return this.holdingsService.createHolding(createHoldingDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all holdings for a user' })
  @ApiResponse({ status: 200, description: 'Holdings retrieved' })
  findHoldingsByUser(@Param('userId') userId: string) {
    return this.holdingsService.findHoldingsByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get holding by ID' })
  @ApiResponse({ status: 200, description: 'Holding found' })
  @ApiResponse({ status: 404, description: 'Holding not found' })
  findHoldingById(@Param('id') id: string) {
    return this.holdingsService.findHoldingById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update holding' })
  @ApiResponse({ status: 200, description: 'Holding updated successfully' })
  @ApiResponse({ status: 404, description: 'Holding not found' })
  updateHolding(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateHoldingDto>,
  ) {
    return this.holdingsService.updateHolding(id, updateData);
  }
}

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.holdingsService.createTransaction(createTransactionDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get transactions for a user' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Transactions retrieved' })
  findTransactionsByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.holdingsService.findTransactionsByUser(
      userId,
      limit ? parseInt(limit) : undefined,
    );
  }

  @Get('holding/:holdingId')
  @ApiOperation({ summary: 'Get transactions for a specific holding' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved' })
  findTransactionsByHolding(@Param('holdingId') holdingId: string) {
    return this.holdingsService.findTransactionsByHolding(holdingId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update transaction status' })
  @ApiResponse({ status: 200, description: 'Transaction status updated' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  updateTransactionStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.holdingsService.updateTransactionStatus(id, status);
  }
}

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get aggregated positions for a user' })
  @ApiResponse({ status: 200, description: 'Positions retrieved' })
  getPositionsByUser(@Param('userId') userId: string) {
    return this.holdingsService.getPositionsByUser(userId);
  }

  @Get('user/:userId/summary')
  @ApiOperation({ summary: 'Get position summary for a user' })
  @ApiResponse({ status: 200, description: 'Summary retrieved' })
  getPositionSummary(@Param('userId') userId: string) {
    return this.holdingsService.getPositionSummary(userId);
  }
}

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Post('user/:userId/snapshot')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create portfolio snapshot' })
  @ApiResponse({ status: 201, description: 'Snapshot created' })
  createSnapshot(@Param('userId') userId: string) {
    return this.holdingsService.createPortfolioSnapshot(userId);
  }

  @Get('user/:userId/history')
  @ApiOperation({ summary: 'Get portfolio history' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'History retrieved' })
  getHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.holdingsService.getPortfolioHistory(
      userId,
      limit ? parseInt(limit) : undefined,
    );
  }
}

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Post('request')
  @ApiOperation({ summary: 'Request a transfer of shares' })
  @ApiResponse({ status: 201, description: 'Transfer request created' })
  @ApiResponse({ status: 400, description: 'Insufficient shares or restricted' })
  requestTransfer(
    @Body('fromUserId') fromUserId: string,
    @Body('toUserId') toUserId: string,
    @Body('holdingId') holdingId: string,
    @Body('shares') shares: number,
    @Body('reason') reason?: string,
  ) {
    return this.holdingsService.requestTransfer(
      fromUserId,
      toUserId,
      holdingId,
      shares,
      reason,
    );
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a transfer request (admin only)' })
  @ApiResponse({ status: 200, description: 'Transfer approved and executed' })
  @ApiResponse({ status: 404, description: 'Transfer request not found' })
  approveTransfer(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.holdingsService.approveTransfer(id, approvedBy);
  }
}
