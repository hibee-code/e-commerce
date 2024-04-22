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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductService = class ProductService {
    constructor(datasource) {
        this.datasource = datasource;
        this.dbManager = datasource.manager;
    }
    async create(product) {
        const newProduct = this.dbManager.create(product_entity_1.Product, product);
        const saveProduct = await this.dbManager.save(newProduct);
        return saveProduct;
    }
    async all_product() {
        const product = await this.dbManager.find(product_entity_1.Product);
        return product;
    }
    async getProductDetails(productId) {
        const product = await this.dbManager.findOne(product_entity_1.Product, {
            where: { id: productId },
        });
        return product;
    }
    async searchProducts(searchQuery) {
        const products = await this.dbManager.find(product_entity_1.Product, {
            where: [
                { name: (0, typeorm_1.ILike)(`%${searchQuery}%`) },
                { brand: (0, typeorm_1.ILike)(`%${searchQuery}%`) },
                { tag: (0, typeorm_1.ILike)(`%${searchQuery}%`) },
                { productCategory: searchQuery },
            ],
        });
        return products;
    }
    async filterProducts(filterParams, page, limit) {
        const whereClause = {};
        if (filterParams.brand || filterParams.name) {
            whereClause.name = filterParams.name;
            whereClause.brand = filterParams.brand;
        }
        if (filterParams.price && filterParams.tag) {
            whereClause.price = filterParams.price;
            whereClause.tag = filterParams.tag;
        }
        else if (filterParams.price) {
            whereClause.price = filterParams.price;
        }
        else if (filterParams.tag) {
            whereClause.tag = filterParams.tag;
        }
        const [products, total] = await this.dbManager.findAndCount(product_entity_1.Product, {
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
        });
        return { products, total };
    }
};
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map