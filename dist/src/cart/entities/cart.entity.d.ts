import { User } from '../../user/entities/user.entity';
import { CartProduct } from '../../cart-product/entities/cartProduct.entity';
export declare class Cart {
    id: string;
    totalPrice: string;
    totalItems: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: User;
    cartProducts: CartProduct[];
    items: any;
}
