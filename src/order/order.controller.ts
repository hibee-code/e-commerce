import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { IsAuthenticated } from '@/shared/isAuthenticated.guard';
import { OrderDto } from './dto/order.dto';
import { Order } from '../utils-billing/entitties/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('view-all-order')
  async getAllOrder(): Promise<Order[]> {
    const allOrder = await this.orderService.getAllOrders();
    return allOrder;
  }

  @Post('create-order')
  //@UseGuards(IsAuthenticated)
  async createOrder(@Body() orderDto: unknown, cartId: number) {
    const newOrder = await this.orderService.createOrder(
      orderDto as OrderDto,
      cartId,
    );
    return newOrder;
  }
}
