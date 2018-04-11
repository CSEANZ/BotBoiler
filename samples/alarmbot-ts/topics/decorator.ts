// import { TurnContext, ConversationState } from "botbuilder";
// import { IStorage } from "../../../src/system/services/extensios/MemoryStorageEx";
// import Startup from "../../../src/system/Startup";
// import { ITopic } from "../../../src/system/contracts/systemContracts";
// import * as BotBoiler from '../../../src/botboiler';
// import { AlarmUser, AlarmConversation } from "../alarmBot";

// // export function TopicTest(target, key, descriptor){
// //     var decoratee = descriptor.value;
// //     return async function decorated(context:TurnContext):Promise<any>{
// //         console.log("Decorator");
// //         const returnValue = decoratee.apply(this, context);
// //         return returnValue;
// //     }
// // }


 
//         export function TopicTest2(target, propertyKey: string, descriptor: PropertyDescriptor){
//             var fn = descriptor.value;
            
//             descriptor.value = async function(context:TurnContext){
//                 var state = BotBoiler.StateHost.ConversationState;
                
//                 var cast: ITopic = target;
//                 var convState = state.get(context);       
//                 if(!convState._botboiler){
//                     convState._botboiler = {};
//                 }
//                 convState._botboiler.topic = cast.id;
//                 fn.call(this, context);
//             }
//         }




// // export function TopicTest(target, key, descriptor) {
    
// //     const fn = descriptor.value;

// //     descriptor.value = async (...args) => {
        
// //         // var store = 
// //         // Startup.Container.get<IStorage>(BotBoiler.Contracts.contractSymbols.Storage).Storage;
        
// //         // var state = new ConversationState(store);        
// //         // var cast: ITopic = target;
// //         // var convState = state.get(context);       
// //         console.log("the function was called with " + JSON.stringify(target));
// //         // console.log("Conv: " + this);
// //         return await fn.apply(target, ...args);
// //         // if(!convState._botboiler){
// //         //     convState._botboiler = {};
// //         // }
// //         // convState._botboiler.topic = cast.id;
// //     };
    
// //}
