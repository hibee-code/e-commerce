import { UserService } from '../user/user.service';
import { User } from '@/user/entities/user.entity';
import { UserSignInDto, UserSignUpDto } from './dto/dto';
import { TokenService } from '../auth/token/token.service';
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    constructor(userService: UserService, tokenService: TokenService);
    verifiedToken(accessToken: string): Promise<User>;
    signup(userSignUpDto: UserSignUpDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    signin(userSignInDto: UserSignInDto): Promise<{
        user: User;
        verifyT: string;
    }>;
}
