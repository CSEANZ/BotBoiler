"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const inversify_1 = require("inversify");
let MemoryStorageEx = class MemoryStorageEx {
    get Storage() {
        return new botbuilder_1.MemoryStorage();
    }
};
MemoryStorageEx = __decorate([
    inversify_1.injectable()
], MemoryStorageEx);
exports.default = MemoryStorageEx;
//# sourceMappingURL=MemoryStorageEx.js.map