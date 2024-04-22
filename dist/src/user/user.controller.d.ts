import { AuthService } from '@/auth/auth.service';
import { UserService } from './user.service';
import { UserSignInDto, UserSignUpDto } from './dto/user.dto';
import { User } from './entities/user.entity';
export declare class UserController {
    private authService;
    private UsersService;
    constructor(authService: AuthService, UsersService: UserService);
    signup(userSignUpDto: UserSignUpDto): Promise<{
        accessToken: string;
    }>;
    signin(userSignInDto: UserSignInDto): Promise<{
        user: User;
        verifyT: string;
    }>;
    getAllUsers(): Promise<User[]>;
    getUser(userId: string): Promise<User>;
}
