import { TurnContext, ConversationState } from "botbuilder";
import { ITopic } from "../contracts/systemContracts";
import Startup from "../Startup";

import { IStorage } from "../services/extensios/MemoryStorageEx";
import * as contracts from "../contracts/systemContracts";
import { StateHost } from "../../botboiler";
import { TextPrompt, DatetimePrompt, Prompt, AttachmentPrompt, ChoicePrompt, ConfirmPrompt } from "botbuilder-dialogs";


 function BoilerPromptBase(prompt: { new(...args: any[]): any; }, 
        target, propertyKey: string, descriptor: PropertyDescriptor)
    {
    
    var getter = function (): contracts.IBotDialog {       
        return new prompt(target[propertyKey]);
    }

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
    BoilerPromptBase(ConfirmPrompt, target, propertyKey, descriptor);     
}


/**
 * Helper to wrap class methods in a DatetimePrompt
 * 
 * @export
 * @param {any} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 */
export function BoilerDatetimePrompt(target, propertyKey: string, descriptor: PropertyDescriptor) {
    BoilerPromptBase(DatetimePrompt, target, propertyKey, descriptor);     
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


export function Topic(target, propertyKey: string, descriptor: PropertyDescriptor) {
    var fn = descriptor.value;

    descriptor.value = async function (context: TurnContext) {

        var state = StateHost.ConversationState;

        var convState = state.get(context);

        if (!convState._botboiler) {
            convState._botboiler = {};
        }

        convState._botboiler.topic = this.id;

        console.log(convState._botboiler);

        var keepOpen = await fn.call(this, context);

        if (!keepOpen) {
            //var convState = state.get(context);

            convState._botboiler.topic = undefined;

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