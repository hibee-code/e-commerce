"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwUnathorized = exports.throwForbidden = exports.throwBadRequest = exports.decodeId = exports.encodeId = exports.encoder = exports.trimObject = exports.getConstructor = exports.createObject = void 0;
const common_1 = require("@nestjs/common");
const hashids_1 = __importDefault(require("hashids"));
const lodash_1 = require("lodash");
function createObject(propsValues) {
    const objectTypeBluePrint = getConstructor(propsValues);
    return new objectTypeBluePrint();
}
exports.createObject = createObject;
function getConstructor(propsValues) {
    return class {
        constructor() {
            if (propsValues) {
                Object.assign(this, propsValues);
            }
        }
    };
}
exports.getConstructor = getConstructor;
function trimObject(propsValues, propsToDelete) {
    return propsToDelete.reduce((prev, curr) => {
        if (curr in prev) {
            delete prev[curr];
        }
        return prev;
    }, propsValues);
}
exports.trimObject = trimObject;
exports.encoder = new hashids_1.default(process.env.APP_KEY, 6, '0123456789BCDGTN');
const encodeId = (id) => {
    return exports.encoder.encode(id);
};
exports.encodeId = encodeId;
const decodeId = (hash) => {
    try {
        const data = exports.encoder.decode(hash);
        if (!data || (0, lodash_1.isEmpty)(data) || (0, lodash_1.get)(data, '0', 'undefined') === 'undefined')
            return false;
        return String(data[0]);
    }
    catch (_a) {
        return false;
    }
};
exports.decodeId = decodeId;
const throwBadRequest = (message) => {
    throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
};
exports.throwBadRequest = throwBadRequest;
const throwForbidden = (message) => {
    throw new common_1.HttpException(message, common_1.HttpStatus.FORBIDDEN);
};
exports.throwForbidden = throwForbidden;
const throwUnathorized = (message) => {
    throw new common_1.HttpException(message, common_1.HttpStatus.UNAUTHORIZED);
};
exports.throwUnathorized = throwUnathorized;
//# sourceMappingURL=helpers.js.map