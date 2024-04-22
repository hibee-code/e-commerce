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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const product_entity_1 = require("../product/entities/product.entity");
const cartProduct_entity_1 = require("../cart-product/entities/cartProduct.entity");
const helpers_1 = require("../utils/helpers");
let CartService = class CartService {
    constructor(datasource) {
        this.datasource = datasource;
        this.dbManager = datasource.manager;
    }
    async createCart(authPayload, cartDto) {
        var _a, e_1, _b, _c;
        const { userData } = authPayload;
        const cartItems = cartDto.cartItems;
        let totalPrice = 0;
        let totalItems = 0;
        let cartProductsarray = [];
        try {
            for (var _d = true, cartItems_1 = __asyncValues(cartItems), cartItems_1_1; cartItems_1_1 = await cartItems_1.next(), _a = cartItems_1_1.done, !_a;) {
                _c = cartItems_1_1.value;
                _d = false;
                try {
                    const productItem = _c;
                    const product = await this.dbManager.findOne(product_entity_1.Product, {
                        where: { id: productItem.productId },
                    });
                    if (!product) {
                        throw new common_1.BadRequestException('One or more product id are invalid');
                    }
                    const newCartProduct = new cartProduct_entity_1.CartProduct();
                    newCartProduct.productId = product.id;
                    newCartProduct.price = product.price;
                    newCartProduct.quantity = productItem.quantity;
                    newCartProduct.image = 'new image';
                    cartProductsarray.push(newCartProduct);
                    totalItems = totalItems + 1;
                    totalPrice = totalPrice + Number(product.price);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = cartItems_1.return)) await _b.call(cartItems_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        let newCart = this.dbManager.create(cart_entity_1.Cart, {
            userId: userData.id,
            totalPrice: String(totalPrice),
            totalItems: totalItems,
        });
        await this.dbManager.transaction(async (transactionManager) => {
            newCart = await transactionManager.save(newCart);
            cartProductsarray = cartProductsarray.map((cartProduct) => {
                cartProduct.cartId = newCart.id;
                return cartProduct;
            });
            await transactionManager.save(cartProductsarray);
        });
        const cart = await this.dbManager.findOne(cart_entity_1.Cart, {
            where: { id: newCart.id },
            relations: {
                cartProducts: true,
            },
        });
        if (!cart) {
            (0, helpers_1.throwBadRequest)('Cart doesn"t exist');
        }
        return cart;
    }
    async getCart(cartId) {
        const cart = await this.dbManager.findOne(cart_entity_1.Cart, {
            where: { id: cartId },
            relations: {
                cartProducts: true,
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        return cart;
    }
    async getAllCarts() {
        const cart = await this.dbManager.find(cart_entity_1.Cart);
        return cart;
    }
    async updateCart(cartId, updateCartDto) {
        var _a, e_2, _b, _c;
        const existingCart = await this.dbManager.findOne(cart_entity_1.Cart, {
            where: { id: cartId },
            relations: {
                cartProducts: true,
            },
        });
        if (!existingCart) {
            throw new common_1.NotFoundException(`Cart with ID ${cartId} not found.`);
        }
        const { cartItems } = updateCartDto;
        try {
            for (var _d = true, cartItems_2 = __asyncValues(cartItems), cartItems_2_1; cartItems_2_1 = await cartItems_2.next(), _a = cartItems_2_1.done, !_a;) {
                _c = cartItems_2_1.value;
                _d = false;
                try {
                    const productItem = _c;
                    const product = await this.dbManager.findOne(product_entity_1.Product, {
                        where: { id: productItem.productId },
                    });
                    if (!product) {
                        throw new common_1.BadRequestException('One or more product IDs are invalid');
                    }
                    const existingCartProduct = existingCart.cartProducts.find((cp) => cp.productId === product.id);
                    if (!existingCartProduct) {
                        let newCartProduct = new cartProduct_entity_1.CartProduct();
                        newCartProduct.price = product.price;
                        newCartProduct.productId = product.id;
                        newCartProduct.quantity = productItem.quantity;
                        newCartProduct.cartId = existingCart.id;
                        newCartProduct.image = 'any image';
                        newCartProduct = await this.dbManager.save(newCartProduct);
                        existingCart.totalItems++;
                        existingCart.totalPrice += Number(product.price) * productItem.quantity;
                    }
                    existingCart.totalPrice = String(Number(existingCart.totalPrice) -
                        Number(existingCartProduct.price) * existingCartProduct.quantity);
                    existingCartProduct.quantity = productItem.quantity;
                    existingCart.totalPrice = String(Number(existingCart.totalPrice) +
                        Number(existingCartProduct.price) * existingCartProduct.quantity);
                    await this.dbManager.save(existingCartProduct);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = cartItems_2.return)) await _b.call(cartItems_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        const updatedCart = await this.dbManager.save(existingCart);
        return updatedCart;
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map