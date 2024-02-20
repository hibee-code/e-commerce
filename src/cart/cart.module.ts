import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TokenService } from '@/auth/token/token.service';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from '../product/product.service';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    TokenService,
    UserService,
    JwtService,
    ProductService,
  ],
  exports: [CartService],
})
export class CartModule {}
