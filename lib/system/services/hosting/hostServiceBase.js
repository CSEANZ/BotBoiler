"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceBase_1 = require("../serviceBase");
const botbuilder_1 = require("botbuilder");
class hostServiceBase extends serviceBase_1.configBase {
    constructor() {
        super();
    }
    init() {
        this.BotStateSet = new botbuilder_1.BotStateSet();
        // this.BotStateSet.use(this.conversationState, this.userState);
    }
}
exports.hostServiceBase = hostServiceBase;
//# sourceMappingURL=hostServiceBase.js.map