"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botboiler_1 = require("../../botboiler");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
function Intent(intent) {
    return function (target) {
        var getter = function () {
            return intent;
        };
        Object.defineProperty(target.prototype, "trigger", { get: getter });
    };
}
exports.Intent = Intent;
function IntentMethod(intent) {
    return function (target, propertyKey, descriptor) {
        var getter = function () {
            return intent;
        };
        Object.defineProperty(target, "trigger", { get: getter });
    };
}
exports.IntentMethod = IntentMethod;
function BoilerPromptBase(prompt, target, propertyKey, descriptor) {
    var getter = function () {
        return new prompt(target[propertyKey]);
    };
    Object.defineProperty(target, "dialog", { get: getter });
}
/**
 * Helper to wrap class methods in a AttachmentPrompt
 *
 * @export
 * @param {any} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 */
function BoilerAttachmentPrompt(target, propertyKey, descriptor) {
    BoilerPromptBase(botbuilder_dialogs_1.AttachmentPrompt, target, propertyKey, descriptor);
}
exports.BoilerAttachmentPrompt = BoilerAttachmentPrompt;
/**
 * Helper to wrap class methods in a ChoicePrompt
 *
 * @export
 * @param {any} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 */
function BoilerChoicePrompt(target, propertyKey, descriptor) {
    BoilerPromptBase(botbuilder_dialogs_1.ChoicePrompt, target, propertyKey, descriptor);
}
exports.BoilerChoicePrompt = BoilerChoicePrompt;
/**
 * Helper to wrap class methods in a ConfirmPrompt
 *
 * @export
 * @param {any} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 */
function BoilerConfirmPrompt(target, propertyKey, descriptor) {
    BoilerPromptBase(botbuilder_dialogs_1.ConfirmPrompt, target, propertyKey, descriptor);
}
exports.BoilerConfirmPrompt = BoilerConfirmPrompt;
/**
 * Helper to wrap class methods in a NumberPrompt
 *
 * @export
 * @param {any} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 */
function BoilerNumberPrompt(target, propertyKey, descriptor) {
    BoilerPromptBase(botbuilder_dialogs_1.ConfirmPrompt, target, propertyKey, descriptor);
}
exports.BoilerNumberPrompt = BoilerNumberPrompt;
/**
 * Helper to wrap class methods in a DatetimePrompt
 *
 * @export
 * @param {any} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 */
function BoilerDatetimePrompt(target, propertyKey, descriptor) {
    BoilerPromptBase(botbuilder_dialogs_1.DatetimePrompt, target, propertyKey, descriptor);
}
exports.BoilerDatetimePrompt = BoilerDatetimePrompt;
/**
 * Helper to wrap class methods in a TextPrompt
 *
 * @export
 * @param {any} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 */
function BoilerTextPrompt(target, propertyKey, descriptor) {
    BoilerPromptBase(botbuilder_dialogs_1.TextPrompt, target, propertyKey, descriptor);
}
exports.BoilerTextPrompt = BoilerTextPrompt;
function _getBoilerConfig(context) {
    var state = botboiler_1.StateHost.ConversationState;
    var convState = state.get(context);
    if (!convState._botboiler) {
        convState._botboiler = {};
    }
    return convState._botboiler;
}
function Topic(target, propertyKey, descriptor) {
    var fn = descriptor.value;
    descriptor.value = async function (context) {
        var _botboiler = _getBoilerConfig(context);
        _botboiler.topic = this.id;
        var keepOpen = await fn.call(this, context);
        if (!keepOpen) {
            //var convState = state.get(context);
            _botboiler.topic = undefined;
            console.log("Closing the topic");
            //  console.log(convState._botboiler);
        }
        return keepOpen;
    };
}
exports.Topic = Topic;
// /**
//  * Alternate method of decorating (for science). 
//  * This one works on the class proto, the other on the instance. 
//  * 
//  * @export
//  * @param {any} target 
//  * @returns 
//  */
// export function BoilerTextPromptClassLevel(target) {
//     if (!target.prototype.prompt) {
//         console.log("No prompt method: public async prompt(context:TurnContext,value:any):Promise<any>{");
//         return;
//     }
//     var getter = function (): contracts.IBotDialog {
//         console.log("ran it!");
//         return new TextPrompt(target.prompt);
//     }
//     Object.defineProperty(target.prototype, "dialog", { get: getter });  
// }
//# sourceMappingURL=decorators.js.map