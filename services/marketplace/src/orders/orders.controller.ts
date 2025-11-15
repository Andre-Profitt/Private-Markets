import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created and matched' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders by user' })
  getOrdersByUser(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUser(userId);
  }

  @Get('book/:companyId/:securityClassId')
  @ApiOperation({ summary: 'Get order book for security' })
  getOrderBook(
    @Param('companyId') companyId: string,
    @Param('securityClassId') securityClassId: string,
  ) {
    return this.ordersService.getOrderBook(companyId, securityClassId);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  cancelOrder(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.ordersService.cancelOrder(id, userId);
  }
}
