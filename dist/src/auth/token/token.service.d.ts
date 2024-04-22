import { UserService } from '../../user/user.service';
import { User } from '@/user/entities/user.entity';
export declare class TokenService {
    private readonly userService;
    private readonly JWT_SECRET;
    constructor(userService: UserService);
    generateAccessToken(user: User): string;
    verifyToken(accessToken: string): Promise<User>;
}
