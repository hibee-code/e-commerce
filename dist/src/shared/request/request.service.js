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
exports.RequestService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
let RequestService = class RequestService {
    constructor(requestApi, configService) {
        this.requestApi = requestApi;
        this.configService = configService;
    }
    async requestAuth(path, { query = {}, body = {}, headers = {}, method = 'GET', baseURL = '', } = {}) {
        const authToken = this.configService.getOrThrow('AUTH_SERVER_API_ACCESS_TOKEN');
        baseURL = baseURL || this.configService.getOrThrow('AUTH_SERVER_URL');
        const Authorization = headers.Authorization || `Besrer ${authToken}`;
        const response = await this.requestApi.axiosRef(path, {
            headers: Object.assign(Object.assign({}, headers), { Authorization }),
            params: query,
            data: body,
            method,
            baseURL,
        });
        return (0, lodash_1.pick)(response, ['data', 'headers', 'request', 'status']);
    }
};
RequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], RequestService);
exports.RequestService = RequestService;
//# sourceMappingURL=request.service.js.map