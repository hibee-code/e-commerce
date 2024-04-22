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
exports.SharedService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = require("bcrypt");
let SharedService = class SharedService {
    constructor(config, jwtService) {
        this.config = config;
        this.jwtService = jwtService;
    }
    async hashPassword(data) {
        const saltRounds = Number(this.config.get('HASH_SALT_ROUNDS') || 10);
        const hashedPassword = await (0, bcrypt_1.hash)(data, saltRounds);
        return hashedPassword;
    }
    async veryfyJwtToken(token) {
        const payload = await this.jwtService.verify(token, {
            secret: this.config.get('JWT_SECRET'),
        });
        return payload;
    }
    signPayload(payload) {
        const stringifiedPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const token = this.jwtService.sign(stringifiedPayload, {
            secret: this.config.get('JWT_SECRET'),
        });
        return token;
    }
    async comparePassword(password, hashedPassword) {
        const isPasswordCorrect = await (0, bcrypt_1.compare)(password, hashedPassword);
        return isPasswordCorrect;
    }
    async isTokenExpired(createdAt, options) {
        const expiry = options.expiresInSeconds || options.expiresInHHours;
        const tokenExpirtyFactor = 1000 * 60 * options.expiresInHHours ? 60 : 1;
        const currentTime = Date.now();
        const timeDifferenceInMilliseconds = currentTime - createdAt.getTime();
        const expiryTime = expiry * tokenExpirtyFactor;
        if (timeDifferenceInMilliseconds > expiryTime) {
            return true;
        }
        return false;
    }
};
SharedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, jwt_1.JwtService])
], SharedService);
exports.SharedService = SharedService;
//# sourceMappingURL=shared.service.js.map