import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto } from '../auth/dto/dto';
import { TokenService } from '../auth/token/token.service';
import { User } from '@/user/entities/user.entity';
import { UserSignUpDto } from '@/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signup(userSignUpDto);
  }

  @Post('signin')
  async signin(
    @Body() userSignInDto: UserSignInDto,
  ): Promise<{ user: User; verifyT: string }> {
    const { user, verifyT } = await this.authService.signin(userSignInDto);
    return { user, verifyT };
  }

  // @Post('verify-token')
  // async verifyToken(
  //   @Body() { accessToken }: { accessToken: string },
  // ): Promise<User> {
  //   try {
  //     const user = await this.authService.verifyToken());
  //     return user;
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid token');
  //   }
  // }
}
