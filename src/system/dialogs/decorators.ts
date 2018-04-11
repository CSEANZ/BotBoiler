import {DecoratorManager, DecoratorTypes, PromptTypes} from './decoratorManager';




export function IsTextPrompt(target, key, descriptor){  
    
    DecoratorManager.pushConfig(DecoratorTypes.PromptConfig, target,  {
        prop: key, 
        type: PromptTypes.TextPrompt
    });    
}

export function IsDateTimePrompt(target, key, descriptor){  
    
    DecoratorManager.pushConfig(DecoratorTypes.PromptConfig, target,  {
        prop: key, 
        type: PromptTypes.DatetimePrompt
    });
    
}

// export function Trigger(match: string | RegExp){    
//     return function(target){         
//         DecoratorManager.pushConfig(DecoratorTypes.Trigger, target, {
//             match: match            
//         })        
//     }
// }
