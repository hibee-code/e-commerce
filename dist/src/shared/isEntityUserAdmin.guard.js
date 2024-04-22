"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEntityUserAdmin = void 0;
class IsEntityUserAdmin {
    constructor() {
    }
    canActivate(context) {
        return this.checkEntityUserAdmin(context);
    }
    checkEntityUserAdmin(context) {
        var _a;
        const req = context.switchToHttp().getRequest();
        const authPayload = req.authPayload;
        if (!authPayload) {
            return false;
        }
        const userIsEntityAdmin = authPayload.userData.id;
        return !!userIsEntityAdmin && !!((_a = authPayload.userData) === null || _a === void 0 ? void 0 : _a.id);
    }
}
exports.IsEntityUserAdmin = IsEntityUserAdmin;
//# sourceMappingURL=isEntityUserAdmin.guard.js.map