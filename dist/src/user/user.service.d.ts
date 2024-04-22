import { UserSignUpDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
export declare class UserService {
    private readonly datasource;
    private dbManager;
    constructor(datasource: DataSource);
    createUser(userSignUpDto: UserSignUpDto): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUserById(userId: string): Promise<User>;
    getUsers(): Promise<User[]>;
}
