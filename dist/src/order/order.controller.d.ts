import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Order } from './entities/order.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    allOrder(): Promise<Order[]>;
    orderByCartId(cartId: string): Promise<Order>;
    orderDetails(cartId: string): Promise<Order>;
    createOrder(orderDto: OrderDto): Promise<Order>;
}
