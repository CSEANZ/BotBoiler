"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const contracts = require("../contracts/systemContracts");
const serviceBase_1 = require("./serviceBase");
/**
 * botService is the main class that creates the bot and registers the dialogs.
 */
let BotBase = class BotBase extends serviceBase_1.serviceBase {
    ContextConfig(context) {
        this.Conversation = this.stateService.getConversationState(context);
        this.User = this.stateService.getUserState(context);
    }
    get Conversation() {
        return this._conversationState;
    }
    set Conversation(state) {
        this._conversationState = state;
    }
    get User() {
        return this._userState;
    }
    set User(state) {
        this._userState = state;
    }
    set Bot(bot) {
        this._bot = bot;
    }
    get Bot() {
        return this._bot;
    }
};
__decorate([
    inversify_1.inject(contracts.contractSymbols.IStateService)
], BotBase.prototype, "stateService", void 0);
BotBase = __decorate([
    inversify_1.injectable()
], BotBase);
exports.default = BotBase;
//# sourceMappingURL=botBase.js.map