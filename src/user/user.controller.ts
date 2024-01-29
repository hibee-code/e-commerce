import { AuthService } from '@/auth/auth.service';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserSignInDto, UserSignUpDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private UsersService: UserService,
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
    return this.authService.signin(userSignInDto);
  }

  @Get('view-all-user')
  async getAllUsers(): Promise<User[]> {
    const allUser = await this.UsersService.getUsers();
    return allUser;
  }

  @Get(':id')
  async getUser(@Param('id') userId: number): Promise<User> {
    const user = await this.UsersService.getUserById(userId);
    if (user) {
      return user;
    }
  }
}
