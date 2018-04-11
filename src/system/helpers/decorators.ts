import { TurnContext, ConversationState } from "botbuilder";
import { ITopic } from "../contracts/systemContracts";
import Startup from "../Startup";

import { IStorage } from "../services/extensios/MemoryStorageEx";
import * as contracts from "../contracts/systemContracts";
import { StateHost } from "../../botboiler";

export function Topic(target, propertyKey: string, descriptor: PropertyDescriptor){
    var fn = descriptor.value;
    
    descriptor.value = async function(context:TurnContext){
        
        var state = StateHost.ConversationState;       
        
        var convState = state.get(context);       

        if(!convState._botboiler){
            convState._botboiler = {};
        }

        convState._botboiler.topic = this.id;
        
        console.log(convState._botboiler);
        
        var keepOpen = await fn.call(this, context);
        
        if(!keepOpen){
            //var convState = state.get(context);

            convState._botboiler.topic = undefined;

            console.log("Closing the topic");
          //  console.log(convState._botboiler);
        }

        return keepOpen;
    }
}
