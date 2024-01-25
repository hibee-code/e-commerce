// import { Body, Controller, Post } from '@nestjs/common';
// import { EntityProfileSignUpDto, SignInDto } from './dto/dto';
// import { AuthService } from './auth.service';
// //import { ProfileService } from '../shared/profile/profile.service';
// //import { SharedService } from '../shared/shared.service';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private authService: AuthService,
// private profileService: ProfileService,
// private sharedService: SharedService,
//   ) {
//     //
//   }
//   @Post('signup')
//   async signupCompanyUser(@Body() signupDto: EntityProfileSignUpDto) {
//     //
//     const authTokenPayload = this.authService.signup(signupDto);
//     return authTokenPayload;
//   }

//   @Post('signin')
//   async login(@Body() signinDto: SignInDto) {
//     //
//     const authTokenPayload = this.authService.signin(signinDto);
//     return authTokenPayload;
//   }
// }

// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto } from '../auth/dto/dto';
import { TokenService } from '../auth/token/token.service';
import { User } from '@/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  async signin(
    @Body() userSignInDto: UserSignInDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.authService.signin(userSignInDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.tokenService.generateAccessToken(user);
    return { accessToken };
  }

  @Post('verify-token')
  async verifyToken(
    @Body() { accessToken }: { accessToken: string },
  ): Promise<User> {
    try {
      const user = await this.authService.verifyToken(accessToken);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
