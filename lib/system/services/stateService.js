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
const inversify_1 = require("inversify");
const botbuilder_1 = require("botbuilder");
const contracts = require("../contracts/systemContracts");
class StateHost {
}
exports.StateHost = StateHost;
let StateService = class StateService {
    constructor(storage) {
        this.gu = this.getUserState;
        this.gc = this.getConversationState;
        this._storage = storage;
        this._conversationState = new botbuilder_1.ConversationState(this._storage.Storage);
        this._userState = new botbuilder_1.UserState(this._storage.Storage);
        StateHost.ConversationState = this._conversationState;
    }
    getBotStateSet() {
        var stateSet = new botbuilder_1.BotStateSet();
        stateSet.use(this._conversationState, this._userState);
        StateHost.BotStateSet = stateSet;
        return stateSet;
    }
    getUserState(context) {
        return this._userState.get(context);
    }
    getConversationState(context) {
        return this._conversationState.get(context);
    }
};
StateService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(contracts.contractSymbols.Storage))
], StateService);
exports.default = StateService;
//# sourceMappingURL=stateService.js.map