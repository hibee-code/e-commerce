"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAuthPayload = void 0;
const common_1 = require("@nestjs/common");
exports.GetAuthPayload = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    if (data) {
        const authPayloadProp = data;
        return request.authPayload
            ? request.authPayload[authPayloadProp]
            : undefined;
    }
    return {
        userData: (_a = request.authPayload) === null || _a === void 0 ? void 0 : _a.userData,
    };
});
//# sourceMappingURL=getAuthenticatedUserPayload.decorator.js.map