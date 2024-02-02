import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [UserService, JwtService],
})
export class UserModule {}
