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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_entity_1 = require("./entities/order.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const cart_service_1 = require("../cart/cart.service");
let OrderService = class OrderService {
    constructor(datasource, cartService) {
        this.datasource = datasource;
        this.cartService = cartService;
        this.dbManager = datasource.manager;
    }
    async getAllOrders() {
        return this.dbManager.find(order_entity_1.Order);
    }
    async createOrder(orderDto, cartId) {
        const order = this.dbManager.create(order_entity_1.Order, Object.assign(Object.assign({}, orderDto), { cartId: cartId }));
        const existingCartId = await this.dbManager.findOne(order_entity_1.Order, {
            where: { cartId: cartId },
        });
        if (existingCartId) {
            throw new common_1.BadRequestException('CartId already exist!!');
        }
        const savedOrder = await this.dbManager.save(order);
        return savedOrder;
    }
    async getOrderId(cartId) {
        const order = await this.dbManager.findOne(order_entity_1.Order, {
            where: { cartId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async getOrderDetails(cartId) {
        const orderDetails = await this.dbManager.findOne(order_entity_1.Order, {
            where: { cartId },
            relations: {
                cart: true,
            },
        });
        if (!orderDetails) {
            throw new common_1.NotFoundException('Order not found');
        }
        return orderDetails;
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        cart_service_1.CartService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map