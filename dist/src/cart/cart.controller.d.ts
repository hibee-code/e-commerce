import { CartService } from '../cart/cart.service';
import { AuthTokenPayload } from '@/lib/types';
import { UpdateCartDto } from './dto/updateCart.dto';
import { Cart } from './entities/cart.entity';
import { CartDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    createCart(cartDto: CartDto, authPayload: AuthTokenPayload): Promise<Cart>;
    getCarts(): Promise<Cart[]>;
    getCart(cartId: string): Promise<Cart>;
    updateCart(cartId: string, updateCartDto: UpdateCartDto): Promise<Cart>;
}
