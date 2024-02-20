import { Order } from './entities/order.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { CartService } from '@/cart/cart.service';

@Injectable()
export class OrderService {
  private dbManager: EntityManager;
  constructor(
    private readonly datasource: DataSource,
    private readonly cartService: CartService,
  ) {
    this.dbManager = datasource.manager;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.dbManager.find(Order);
  }

  async createOrder(orderDto: OrderDto, cartId: string): Promise<Order> {
    const order = this.dbManager.create(Order, {
      ...orderDto,
      cartId: cartId,
    });
    const existingCartId = await this.dbManager.findOne(Order, {
      where: { cartId: cartId },
    });

    if (existingCartId) {
      throw new BadRequestException('CartId already exist!!');
    }
    const savedOrder = await this.dbManager.save(order);
    return savedOrder;
  }
  async getOrderId(cartId: string): Promise<Order> {
    const order = await this.dbManager.findOne(Order, {
      where: { cartId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrderDetails(cartId: string): Promise<Order> {
    const orderDetails = await this.dbManager.findOne(Order, {
      where: { cartId },
      relations: ['cart'],
    });

    if (!orderDetails) {
      throw new NotFoundException('Order not found');
    }

    return orderDetails;
  }
}
