import { DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AuthTokenPayload } from '@/lib/types';
import { CartDto } from './dto/cart.dto';
import { UpdateCartDto } from './dto/updateCart.dto';
export declare class CartService {
    private readonly datasource;
    private dbManager;
    constructor(datasource: DataSource);
    createCart(authPayload: AuthTokenPayload, cartDto: CartDto): Promise<Cart>;
    getCart(cartId: string): Promise<Cart>;
    getAllCarts(): Promise<Cart[]>;
    updateCart(cartId: string, updateCartDto: UpdateCartDto): Promise<Cart>;
}
