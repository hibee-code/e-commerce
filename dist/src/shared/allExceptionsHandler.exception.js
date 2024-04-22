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
exports.AllExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let AllExceptionFilter = class AllExceptionFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const httpContext = host.switchToHttp();
        const httpStatus = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const request = httpContext.getRequest();
        const responseBody = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ timestamp: new Date().toISOString(), statusCode: httpStatus }, ('message' in exception ? { message: exception.message } : {})), { path: httpAdapter.getRequestUrl(httpContext.getRequest()) }), ('cause' in exception ? { cause: exception.cause } : {})), ('stack' in exception ? { stack: exception.stack } : {})), ('response' in exception ? { response: exception.response } : {}));
        if ([common_1.HttpStatus.BAD_REQUEST, common_1.HttpStatus.INTERNAL_SERVER_ERROR].includes(httpStatus)) {
            common_1.Logger.error(`Execption has been thrown when accessing the path: ${responseBody.path}`, responseBody, { requstBody: Object.assign({}, request.body), requestMethod: request.method });
            delete responseBody.stack;
            httpAdapter.reply(httpContext.getResponse(), responseBody, httpStatus);
        }
        else if ([common_1.HttpStatus.FORBIDDEN, common_1.HttpStatus.UNAUTHORIZED].includes(httpStatus)) {
            common_1.Logger.error(`Execption has been thrown when accessing the path: ${responseBody.path}`, responseBody, { requstBody: Object.assign({}, request.body), requestMethod: request.method });
            delete responseBody.stack;
            delete responseBody.cause;
            httpAdapter.reply(httpContext.getResponse(), responseBody, httpStatus);
        }
        else {
            httpAdapter.reply(httpContext.getResponse(), { message: responseBody.message }, httpStatus);
        }
    }
};
AllExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], AllExceptionFilter);
exports.AllExceptionFilter = AllExceptionFilter;
//# sourceMappingURL=allExceptionsHandler.exception.js.map