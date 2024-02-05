import { Order } from '../utils-billing/entitties/order.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private dbManager: EntityManager;
  constructor(private readonly datasource: DataSource) {
    this.dbManager = datasource.manager;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.dbManager.find(Order);
  }

  async createOrder(orderDto: OrderDto, cartId: number): Promise<Order> {
    const order = this.dbManager.create(Order, {
      ...orderDto,
      cartId: cartId,
    });
    const savedOrder = await this.dbManager.save(order);
    return savedOrder;
  }
}
