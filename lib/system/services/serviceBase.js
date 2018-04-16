"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const systemContracts = require("../contracts/systemContracts");
let configBase = configBase_1 = class configBase {
    resolve(symbol) {
        return configBase_1.Container.get(symbol);
    }
};
__decorate([
    inversify_1.inject(systemContracts.contractSymbols.IConfig)
], configBase.prototype, "config", void 0);
configBase = configBase_1 = __decorate([
    inversify_1.injectable()
], configBase);
exports.configBase = configBase;
let serviceBase = class serviceBase extends configBase {
};
__decorate([
    inversify_1.inject(systemContracts.contractSymbols.ILogService)
], serviceBase.prototype, "logger", void 0);
serviceBase = __decorate([
    inversify_1.injectable()
], serviceBase);
exports.serviceBase = serviceBase;
var configBase_1;
//# sourceMappingURL=serviceBase.js.map