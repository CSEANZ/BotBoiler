"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let DecoratorTypes = {
    PromptConfig: "boiler_prompts",
    Trigger: "boiler_trigger"
};
exports.DecoratorTypes = DecoratorTypes;
let PromptTypes = {
    TextPrompt: "TextPrompt",
    DatetimePrompt: "DatetimePrompt"
};
exports.PromptTypes = PromptTypes;
class decoratorManager {
    pushConfig(property, target, config) {
        var cfg = this.getConfig(property, target);
        cfg.push(config);
        this.setConfig(property, target, config);
    }
    setConfig(property, target, config) {
        var cfgNode = target._boilerconfig;
        if (!cfgNode) {
            cfgNode = {};
        }
        cfgNode[property] = config;
        target._boilerconfig = cfgNode;
    }
    getConfig(property, target) {
        var cfgNode = target._boilerconfig;
        if (!cfgNode) {
            cfgNode = {};
        }
        var promptconfig = cfgNode[property];
        if (!promptconfig) {
            promptconfig = [];
        }
        return promptconfig;
    }
}
exports.default = decoratorManager;
var DecoratorManager = new decoratorManager();
exports.DecoratorManager = DecoratorManager;
//# sourceMappingURL=decoratorManager.js.map