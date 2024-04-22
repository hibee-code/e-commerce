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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("../cart/cart.service");
const getAuthenticatedUserPayload_decorator_1 = require("../shared/getAuthenticatedUserPayload.decorator");
const isAuthenticated_guard_1 = require("../shared/isAuthenticated.guard");
const updateCart_dto_1 = require("./dto/updateCart.dto");
const cart_dto_1 = require("./dto/cart.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async createCart(cartDto, authPayload) {
        const newCart = await this.cartService.createCart(authPayload, cartDto);
        return newCart;
    }
    async getCarts() {
        const allCarts = await this.cartService.getAllCarts();
        return allCarts;
    }
    async getCart(cartId) {
        const cart = await this.cartService.getCart(cartId);
        return cart;
    }
    async updateCart(cartId, updateCartDto) {
        const updateCart = await this.cartService.updateCart(cartId, updateCartDto);
        return updateCart;
    }
};
__decorate([
    (0, common_1.Post)('create-cart'),
    (0, common_1.UseGuards)(isAuthenticated_guard_1.IsAuthenticated),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, getAuthenticatedUserPayload_decorator_1.GetAuthPayload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_dto_1.CartDto, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "createCart", null);
__decorate([
    (0, common_1.Get)('view-all-cart'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCarts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Put)('update-cart/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateCart_dto_1.UpdateCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateCart", null);
CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map