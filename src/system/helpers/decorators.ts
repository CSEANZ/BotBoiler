import { TurnContext, ConversationState } from "botbuilder";
import { ITopic } from "../contracts/systemContracts";
import Startup from "../Startup";
import { IStorage } from "../services/extensios/MemoryStorageEx";
import * as contracts from "../contracts/systemContracts";




export function Topic(target, key, descriptor) {

    descriptor.value = (context: TurnContext) => {
        var state = new ConversationState(
            Startup.Container.get<IStorage>(contracts.contractSymbols.Storage).Storage);

        var cast: ITopic = target;
        var convState: any = state.get(context);
        convState._botboiler.topic = cast.id;
    }
}
