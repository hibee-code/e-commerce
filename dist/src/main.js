"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const envs_1 = __importDefault(require("./config/envs"));
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        prefix: 'v1',
    });
    const appName = envs_1.default.PROJECT_NAME || 'Nest Js app';
    const port = Number(envs_1.default.SERVER_PORT || 5200);
    await app.listen(port);
    common_1.Logger.log('', `${appName} started on port ${port}`);
    const httpServer = app.getHttpServer();
    const router = httpServer._events.request._router;
    const availableRoutes = router.stack
        .map((layer) => {
        var _a, _b;
        if (layer.route) {
            return {
                route: {
                    path: (_a = layer.route) === null || _a === void 0 ? void 0 : _a.path,
                    method: (_b = layer.route) === null || _b === void 0 ? void 0 : _b.stack[0].method,
                },
            };
        }
    })
        .filter((item) => item !== undefined);
    common_1.Logger.log(availableRoutes, 'Available routes');
}
bootstrap();
//# sourceMappingURL=main.js.map