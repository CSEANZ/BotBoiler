import { TurnContext, ConversationState } from "botbuilder";
import { ITopic } from "../contracts/systemContracts";
import Startup from "../startup";

import { IStorage } from "../services/extensios/MemoryStorageEx";
import * as contracts from "../contracts/systemContracts";
import { StateHost } from "../../botboiler";
import { TextPrompt, DatetimePrompt, Prompt, AttachmentPrompt, ChoicePrompt, ConfirmPrompt, NumberPrompt } from "botbuilder-dialogs";

/**
 * This is a cool decorator
 * 
 * @export
 * @param {(string|RegExp)} intent 
 * @returns 
 */
export function Intent(intent:string|RegExp){
    return function(target){
        var getter = function():string|RegExp{
            return intent;
        }
        Object.defineProperty(target.prototype, "trigger", {get: getter});
    }
}

export function IntentMethod(intent:string|RegExp){
    return function(target, propertyKey: string, descriptor: PropertyDescriptor){
        var getter = function():string|RegExp{
            return intent;
        }
        Object.defineProperty(target, "trigger", {get: getter});
    }
}


function BoilerPromptBase(prompt: { new(...args: any[]): any; },
    target, propertyKey: string, descriptor: PropertyDescriptor, retries:number = 3) {

    var getter = function (): contracts.IBotDialog {
        return new prompt(target[propertyKey]);
    }

    Object.defineProperty(target, "dialog", { get: getter });

    var getretries = function (): number {
        return retries;
    } 

    Object.defineProperty(target, "retries", { get: getretries });   
}

/**
 * Helper to wrap class methods in a AttachmentPrompt
 * 
 * @export
 * @param {any} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 */
export function BoilerAttachmentPrompt(target, propertyKey: string, descriptor: PropertyDescriptor) {
    BoilerPromptBase(AttachmentPrompt, target, propertyKey, descriptor);
}

/**
 * Helper to wrap class methods in a ChoicePrompt
 * 
 * @export
 * @param {any} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 */
export function BoilerChoicePrompt(target, propertyKey: string, descriptor: PropertyDescriptor) {
    BoilerPromptBase(ChoicePrompt, target, propertyKey, descriptor);
}

/**
 * Helper to wrap class methods in a ConfirmPrompt
 * 
 * @export
 * @param {any} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 */
export function BoilerConfirmPrompt(target, propertyKey: string, descriptor: PropertyDescriptor) {
    BoilerPromptBase(ConfirmPrompt, target, propertyKey, descriptor);
}

/**
 * Helper to wrap class methods in a NumberPrompt
 * 
 * @export
 * @param {any} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 */
export function BoilerNumberPrompt(target, propertyKey: string, descriptor: PropertyDescriptor) {
    BoilerPromptBase(NumberPrompt, target, propertyKey, descriptor);
}


/**
 * Helper to wrap class methods in a DatetimePrompt
 * 
 * @export
 * @param {any} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 */

export function BoilerDatetimePrompt(retries:number = 2) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor){
        BoilerPromptBase(DatetimePrompt, target, propertyKey, descriptor);
    }   
}

/**
 * Helper to wrap class methods in a TextPrompt
 * 
 * @export
 * @param {any} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 */
export function BoilerTextPrompt(target, propertyKey: string, descriptor: PropertyDescriptor) {
    BoilerPromptBase(TextPrompt, target, propertyKey, descriptor);
}

function _getBoilerConfig(context:TurnContext): any{
    var state = StateHost.ConversationState;

    var convState = state.get(context);

    if (!convState._botboiler) {
        convState._botboiler = {};
    }

    return convState._botboiler;

}

export function Topic(target, propertyKey: string, descriptor: PropertyDescriptor) {
    var fn = descriptor.value;

    descriptor.value = async function (context: TurnContext) {        

        var state = StateHost.ConversationState;
        
        var convState = state.get(context);
        var userState =  StateHost.UserState.get(context);

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
    }
}



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