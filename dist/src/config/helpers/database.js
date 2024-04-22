"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDataSourceFor = exports.dataSourceFor = void 0;
const lodash_1 = require("lodash");
const defaultConnection = __importStar(require("../database/connections/default"));
const dataSourceFor = (connectionName = 'default') => {
    try {
        const res = require(`../database/connections/${connectionName}`);
        const connDataSource = (res.default || res);
        if (connDataSource) {
            if (!connDataSource.isInitialized) {
                connDataSource.initialize();
                return connDataSource;
            }
            return connDataSource;
        }
        return defaultConnection.default;
    }
    catch (err) {
        return defaultConnection.default;
    }
};
exports.dataSourceFor = dataSourceFor;
const connectDataSourceFor = async (connectionName = 'default') => {
    try {
        const res = require(`../database/connections/${connectionName}`);
        const connDataSource = (res.default || res);
        if (connDataSource) {
            if (!connDataSource.isInitialized) {
                await connDataSource.initialize();
                console.log(`${(0, lodash_1.capitalize)(connectionName)} Data Source Connected Succesfully`);
                return connDataSource;
            }
            console.log(`${(0, lodash_1.capitalize)(connectionName)} Data Source Was Already Connected`);
            return connDataSource;
        }
        throw `Could not connect to data source named ${connectionName}`;
    }
    catch (err) {
        console.error(`Error during ${(0, lodash_1.capitalize)(connectionName)} Data Source initialization`, err);
        throw `Could not connect to data source named ${connectionName}`;
    }
};
exports.connectDataSourceFor = connectDataSourceFor;
//# sourceMappingURL=database.js.map