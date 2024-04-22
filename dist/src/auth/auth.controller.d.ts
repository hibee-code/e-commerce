import { AuthService } from './auth.service';
import { UserSignInDto } from '../auth/dto/dto';
import { TokenService } from '../auth/token/token.service';
import { User } from '@/user/entities/user.entity';
import { UserSignUpDto } from '@/user/dto/user.dto';
export declare class AuthController {
    private readonly tokenService;
    private readonly authService;
    constructor(tokenService: TokenService, authService: AuthService);
    signup(userSignUpDto: UserSignUpDto): Promise<{
        accessToken: string;
    }>;
    signin(userSignInDto: UserSignInDto): Promise<{
        user: User;
        verifyT: string;
    }>;
}
