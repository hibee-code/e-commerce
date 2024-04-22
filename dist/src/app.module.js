"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_config_1 = __importDefault(require("./config/envs/app.config"));
const aws_config_1 = __importDefault(require("./config/envs/aws.config"));
const default_1 = __importDefault(require("./config/database/connections/default"));
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const nestjs_pino_1 = require("nestjs-pino");
const helmet_1 = __importDefault(require("helmet"));
const general_1 = require("./config/helpers/general");
const app_service_1 = require("./app.service");
const extractToken_middleware_1 = require("./shared/extractToken.middleware");
const auth_module_1 = require("./auth/auth.module");
const shared_module_1 = require("./shared/shared.module");
const shared_service_1 = require("./shared/shared.service");
const user_module_1 = require("./user/user.module");
const token_service_1 = require("./auth/token/token.service");
const user_service_1 = require("./user/user.service");
const cart_module_1 = require("./cart/cart.module");
const order_module_1 = require("./order/order.module");
const product_module_1 = require("./product/product.module");
const cors = require('cors');
const validator = new common_1.ValidationPipe({
    whitelist: false,
    transform: true,
    exceptionFactory(errors) {
        const formattedErrors = errors;
        return new common_1.BadRequestException({
            type: 'VALIDATION_ERROR',
            errors: formattedErrors,
            message: 'Invalid data',
        }, 'Bad Request');
    },
});
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(cors(), (0, helmet_1.default)(), extractToken_middleware_1.ExtractTokenMiddleWare)
            .exclude('/auth/*')
            .exclude('')
            .forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRootAsync({
                inject: [app_config_1.default.KEY],
                async useFactory(applicationConfig) {
                    const nodeEnv = applicationConfig.NODE_ENV;
                    return {
                        pinoHttp: {
                            transport: {
                                target: 'pino-pretty',
                                options: nodeEnv === 'production'
                                    ? {
                                        destination: (0, general_1.pathFromRoot)('./logs/pm2/out.log'),
                                        colorize: false,
                                        mkdir: true,
                                        crlf: true,
                                    }
                                    : undefined,
                            },
                        },
                    };
                },
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: ['.env'],
                isGlobal: true,
                load: [app_config_1.default, aws_config_1.default],
                cache: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                name: 'default',
                useFactory: () => ({}),
                dataSourceFactory: async () => {
                    if (!default_1.default.isInitialized) {
                        default_1.default.setOptions({ entities: ['dist/**/*.entity.js'] });
                        await default_1.default.initialize();
                    }
                    return default_1.default;
                },
            }),
            jwt_1.JwtModule.registerAsync({
                async useFactory(configService) {
                    await config_1.ConfigModule.envVariablesLoaded;
                    return {
                        signOptions: {
                            expiresIn: configService.get('app.JWT_EXPIRY', '8h'),
                        },
                        secret: configService.get('app.JWT_SECRET'),
                    };
                },
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            shared_module_1.SharedModule,
            user_module_1.UserModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            product_module_1.ProductModule,
        ],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useValue: validator,
            },
            shared_service_1.SharedService,
            jwt_1.JwtService,
            app_service_1.AppService,
            token_service_1.TokenService,
            user_service_1.UserService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map