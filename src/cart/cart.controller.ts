import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { CartDto } from '../cart/dto/cart.dto';
import { CartService } from '../cart/cart.service';
import { GetAuthPayload } from '@/shared/getAuthenticatedUserPayload.decorator';
import { AuthTokenPayload } from '@/lib/types';
import { IsAuthenticated } from '@/shared/isAuthenticated.guard';
import { Cart } from '@/utils-billing/entitties/cart.entity';
import { UpdateCartDto } from './dto/updateCart.dto';
//import { IsAuthenticated } from '@/shared/isAuthenticated.guard';
//import { JwtAuthGuard } from '@/auth/token/token.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create-cart')
  @UseGuards(IsAuthenticated)
  async createCart(
    @Body() cartDto: CartDto,
    @GetAuthPayload() authPayload: AuthTokenPayload,
  ) {
    const newCart = await this.cartService.createCart(authPayload, cartDto);
    return newCart;
  }

  @Get('view-all-cart')
  //@UseGuards(IsAuthenticated)
  async getUserCarts(): Promise<Cart[]> {
    const allCarts = await this.cartService.getAllCarts();
    return allCarts;
  }
  @Get(':id')
  async getCart(@Param('id') cartId: number): Promise<Cart> {
    const cart = await this.cartService.getCart(cartId);
    return cart;
  }
  @Put('update-cart/:id')
  async updateCart(
    @Param('id') cartId: number,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const updateCart = await this.cartService.updateCart(cartId, updateCartDto);
    return updateCart;
  }
}
