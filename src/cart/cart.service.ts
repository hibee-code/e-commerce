import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CartDto } from './dto/cart.dto';
import { Cart } from '../utils-billing/entitties/cart.entity';
import { UserService } from '@/user/user.service';
import { User } from '@/user/entities/user.entity';
import { AuthTokenPayload } from '@/lib/types';

@Injectable()
export class CartService {
  private dbManager: EntityManager;
  constructor(
    private readonly datasource: DataSource,
    private readonly userService: UserService,
  ) {
    this.dbManager = datasource.manager;
  }

  async createCart(
    authPayload: AuthTokenPayload,
    cartDto: CartDto,
  ): Promise<Cart> {
    const { userData } = authPayload;

    const newCart = this.dbManager.create<Cart>(Cart, {
      ...cartDto,
      userId: userData.id,
    });

    const savedCart = await this.dbManager.save(newCart);
    return savedCart;
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    const cartUser = await this.dbManager.findOne(Cart, {
      where: { userId },
    });
    if (!cartUser) {
      throw new NotFoundException('CartUser not found');
    }
    return cartUser;
  }
  async getCart(cartId: number): Promise<Cart> {
    const cart = await this.dbManager.findOneBy(Cart, { id: cartId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async getAllCarts(): Promise<Cart[]> {
    const cart = await this.dbManager.find(Cart);
    return cart;
  }

  async updateCart(cartId: number, updateCartDto: CartDto): Promise<Cart> {
    const existingCart = await this.dbManager.findOne(Cart, {
      where: { id: cartId },
    });

    if (!existingCart) {
      throw new NotFoundException('Cart not Found');
    }
    Object.assign(existingCart, updateCartDto);

    const updatedCart = await this.dbManager.save(existingCart);
    return updatedCart;
  }
}
