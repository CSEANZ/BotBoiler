import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter, TurnContext } from 'botbuilder';
import { botStateBase } from './botStateBase';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export abstract class botService<TUserState, TConversationState> extends botStateBase<TUserState,TConversationState>  implements contracts.IBotService {    

    @inject(contracts.contractSymbols.IHostService)
    public hostService : contracts.IHostService<TUserState, TConversationState>   
    @inject(contracts.contractSymbols.IStateService)
    public stateService: contracts.IStateService<TUserState, TConversationState>
    
    /**
     *
     */
    constructor() {
        super();        
    }
    /**
    * Boot the bot - creates a connector, bot and registers the dynamic dialogs. 
    */

    public boot(){
        this.hostService.init(this.botCallback.bind(this)); 
    }   
    
    abstract botCallback(context:TurnContext) : void;
}


