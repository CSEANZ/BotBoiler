"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const contracts = require("../../contracts/systemContracts");
const inversify_1 = require("inversify");
let consoleHostService = class consoleHostService {
    /**
     *
     */
    constructor(stateService) {
        this._stateService = stateService;
    }
    init(callbacks) {
        var adapter = new botbuilder_1.ConsoleAdapter();
        adapter.use(this._stateService.getBotStateSet());
        this.log("Local Context");
        // Listen for incoming requests 
        adapter.listen(async (context) => {
            for (var i in callbacks) {
                await callbacks[i](context);
            }
        });
    }
    log(message) {
        console.log(message);
    }
    get export() {
        return null;
    }
};
consoleHostService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(contracts.contractSymbols.IStateService))
], consoleHostService);
exports.consoleHostService = consoleHostService;
//# sourceMappingURL=consoleHostService.js.map