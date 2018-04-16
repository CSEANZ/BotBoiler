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
const botBase_1 = require("./botBase");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
/**
 * botService is the main class that creates the bot and registers the dialogs.
 */
let BoilerBot = class BoilerBot extends botBase_1.default {
    /**
     *
     */
    constructor() {
        super();
        this._dialogSet = new botbuilder_dialogs_1.DialogSet();
    }
    /**
    * Boot the bot - creates a connector, bot and registers the dynamic dialogs.
    */
    boot() {
        this.createTopics();
        this.createDialogs();
        this.hostService.init([
            this.botCallback.bind(this)
        ]);
    }
    createTopics() {
        this._topics = this.topicFactory();
        for (var d in this._topics) {
            var topic = this._topics[d];
            topic.Bot = this;
            console.log(topic.id);
        }
    }
    _prepBot(botItem, context) {
        if (botItem.ContextConfig) {
            var cast = botItem;
            cast.ContextConfig(context);
        }
    }
    async runTopics(context, intent) {
        var convState = this.stateService.getConversationState(context);
        for (var t in this._topics) {
            var topic = this._topics[t];
            this._prepBot(topic, context);
            var trigger = topic.trigger;
            if (convState._botboiler && convState._botboiler.topic === topic.id) {
                await topic.routeReply(context);
                return true;
            }
            if (trigger) {
                if (trigger instanceof RegExp) {
                    if (trigger.test(intent)) {
                        await topic.begin(context);
                        return true;
                    }
                }
                else {
                    if (trigger == intent) {
                        await topic.begin(context);
                        return true;
                    }
                }
            }
        }
    }
    async RunDialog(dialog, context, force = false) {
        var convState = this.stateService.getConversationState(context);
        const dc = this._dialogSet.createContext(context, convState);
        if (!dc.instance || force) {
            await dc.begin(dialog.id);
        }
    }
    async PromptDialog(dialog, prompt, context) {
        var convState = this.stateService.getConversationState(context);
        const dc = this._dialogSet.createContext(context, convState);
        dc.prompt(dialog.id, prompt);
    }
    async runDialogs(context, intent) {
        try {
            var convState = this.stateService.getConversationState(context);
            const dc = this._dialogSet.createContext(context, convState);
            if (dc.instance) {
                this._prepBot(dc.instance, context);
                await dc.continue();
                if (context.responded) {
                    return true;
                }
                return false;
            }
            for (var i in this._dialogs) {
                var dialog = this._dialogs[i];
                var trigger = dialog.trigger;
                this._prepBot(dialog, context);
                if (trigger) {
                    if (trigger instanceof RegExp) {
                        if (trigger.test(intent)) {
                            await dc.begin(dialog.id);
                            return true;
                        }
                    }
                    else {
                        if (trigger == intent) {
                            await dc.begin(dialog.id);
                            return true;
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        return false;
    }
    _isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
    createDialogs() {
        this._dialogs = this.dialogFactory();
        for (var i in this._dialogs) {
            var dialog = this._dialogs[i];
            dialog.Bot = this;
            if (dialog.waterfall) {
                this._dialogSet.add(dialog.id, dialog.waterfall);
            }
            else if (dialog.dialog) {
                var d = dialog.dialog;
                this._dialogSet.add(dialog.id, dialog.dialog);
            }
            else {
                console.log(`**** warning dialog: ${i} does not implement waterfall or dialog`);
            }
        }
    }
};
__decorate([
    inversify_1.inject(contracts.contractSymbols.IHostService)
], BoilerBot.prototype, "hostService", void 0);
__decorate([
    inversify_1.inject(contracts.contractSymbols.IStateService)
], BoilerBot.prototype, "stateService", void 0);
__decorate([
    inversify_1.inject("Factory<IDialog>")
], BoilerBot.prototype, "dialogFactory", void 0);
__decorate([
    inversify_1.inject("Factory<ITopic>")
], BoilerBot.prototype, "topicFactory", void 0);
BoilerBot = __decorate([
    inversify_1.injectable()
], BoilerBot);
exports.default = BoilerBot;
//# sourceMappingURL=boilerBot.js.map