"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const user_service_1 = require("../user/user.service");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const token_service_1 = require("./token/token.service");
const auth_controller_1 = require("./auth.controller");
const user_controller_1 = require("../user/user.controller");
const jwt_1 = require("@nestjs/jwt");
const cart_service_1 = require("../cart/cart.service");
const product_service_1 = require("../product/product.service");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        providers: [
            user_service_1.UserService,
            auth_service_1.AuthService,
            token_service_1.TokenService,
            jwt_1.JwtService,
            cart_service_1.CartService,
            product_service_1.ProductService,
        ],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map