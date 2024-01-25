import { AuthService } from '@/auth/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { UserSignUpDto } from './dto/user.dto';

@Controller('auth')
export class UserController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signup(userSignUpDto);
  }
}
