import { Product } from '../../product/entities/product.entity';
import { Cart } from '../../cart/entities/cart.entity';
export declare class CartProduct {
    cartId: string;
    productId: string;
    quantity: number;
    price: string;
    image: string;
    createdAt: Date;
    updateAt: Date;
    cart: Cart;
    product: Product;
}
