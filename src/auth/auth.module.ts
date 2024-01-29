import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';
import { AuthController } from './auth.controller';
import { UserController } from '@/user/user.controller';
//import { SharedModule } from '../shared/shared.module';

@Module({
  providers: [UserService, AuthService, TokenService],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
