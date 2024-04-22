import { Order } from './entities/order.entity';
import { DataSource } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { CartService } from '@/cart/cart.service';
export declare class OrderService {
    private readonly datasource;
    private readonly cartService;
    private dbManager;
    constructor(datasource: DataSource, cartService: CartService);
    getAllOrders(): Promise<Order[]>;
    createOrder(orderDto: OrderDto, cartId: string): Promise<Order>;
    getOrderId(cartId: string): Promise<Order>;
    getOrderDetails(cartId: string): Promise<Order>;
}
