import { DeliveryStatus, PaymentStatus } from '../../lib/enums';
import { Cart } from '../../cart/entities/cart.entity';
import { User } from '../../user/entities/user.entity';
export declare class Order {
    id: string;
    isPaid: boolean;
    orderDate: Date;
    deliveryStatus: DeliveryStatus;
    paymentStatus: PaymentStatus;
    cartId: string;
    cart: Cart;
    user: User;
}
