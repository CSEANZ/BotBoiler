"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorManager_1 = require("./decoratorManager");
function IsTextPrompt(target, key, descriptor) {
    decoratorManager_1.DecoratorManager.pushConfig(decoratorManager_1.DecoratorTypes.PromptConfig, target, {
        prop: key,
        type: decoratorManager_1.PromptTypes.TextPrompt
    });
}
exports.IsTextPrompt = IsTextPrompt;
function IsDateTimePrompt(target, key, descriptor) {
    decoratorManager_1.DecoratorManager.pushConfig(decoratorManager_1.DecoratorTypes.PromptConfig, target, {
        prop: key,
        type: decoratorManager_1.PromptTypes.DatetimePrompt
    });
}
exports.IsDateTimePrompt = IsDateTimePrompt;
// export function Trigger(match: string | RegExp){    
//     return function(target){         
//         DecoratorManager.pushConfig(DecoratorTypes.Trigger, target, {
//             match: match            
//         })        
//     }
// }
//# sourceMappingURL=decorators.js.map