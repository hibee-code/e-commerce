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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./dto/user.dto");
const isAuthenticated_guard_1 = require("../shared/isAuthenticated.guard");
let UserController = class UserController {
    constructor(authService, UsersService) {
        this.authService = authService;
        this.UsersService = UsersService;
    }
    async signup(userSignUpDto) {
        return this.authService.signup(userSignUpDto);
    }
    signin(userSignInDto) {
        return this.authService.signin(userSignInDto);
    }
    async getAllUsers() {
        const allUser = await this.UsersService.getUsers();
        return allUser;
    }
    async getUser(userId) {
        const user = await this.UsersService.getUserById(userId);
        if (user) {
            return user;
        }
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.UseGuards)(isAuthenticated_guard_1.IsAuthenticated),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserSignUpDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, common_1.UseGuards)(isAuthenticated_guard_1.IsAuthenticated),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserSignInDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('view-all-user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map