import { Injectable, BadRequestException } from '@nestjs/common';
import { UserSignUpDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  private dbManager: EntityManager;
  constructor(private readonly datasource: DataSource) {
    this.dbManager = datasource.manager;
  }

  async createUser(userSignUpDto: UserSignUpDto): Promise<User> {
    const { password, ...rest } = userSignUpDto;

    const hash = bcrypt.hashSync(password, 10);

    const newUser = this.dbManager.create(User, { ...rest, password: hash });

    const savedNewUser = await this.dbManager.save(newUser);

    if (!savedNewUser) {
      throw new BadRequestException(' No user was created');
    }
    return savedNewUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.dbManager.findOne(User, {
      where: {
        email: email,
      },
    });

    return user;
  }

  //   async getAllUser(userSignUpDto): Promise<User> {
  //     const user = await this.userService.getUserById(userId);

  //     if (!user) {
  //       throw new BadRequestException('User not found');
  //     }

  //     return user;
  //   }
}
