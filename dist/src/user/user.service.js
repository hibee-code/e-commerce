"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const typeorm_1 = require("typeorm");
let UserService = class UserService {
    constructor(datasource) {
        this.datasource = datasource;
        this.dbManager = datasource.manager;
    }
    async createUser(userSignUpDto) {
        const { password } = userSignUpDto;
        const existingUser = await this.dbManager.findOne(user_entity_1.User, {
            where: {
                email: userSignUpDto.email,
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exist!!');
        }
        const hash = bcrypt_1.default.hashSync(password, 10);
        const newUser = this.dbManager.create(user_entity_1.User, Object.assign(Object.assign({}, userSignUpDto), { password: hash }));
        const savedNewUser = await this.dbManager.save(newUser);
        if (!savedNewUser) {
            throw new common_1.BadRequestException(' No user was created');
        }
        return savedNewUser;
    }
    async getUserByEmail(email) {
        const user = await this.dbManager.findOne(user_entity_1.User, {
            where: {
                email: email,
            },
        });
        return user;
    }
    async getUserById(userId) {
        const user = await this.dbManager.findOneBy(user_entity_1.User, { id: userId });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async getUsers() {
        const users = await this.dbManager.find(user_entity_1.User, {
            select: ['firstName', 'lastName', 'email'],
        });
        return users;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map