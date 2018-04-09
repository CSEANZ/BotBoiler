import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter, TurnContext } from 'botbuilder';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export abstract class botStateBase<TUserState, TConversationState> extends serviceBase {    

    @inject(contracts.contractSymbols.IHostService)
    public hostService : contracts.IHostService<TUserState, TConversationState>   
    @inject(contracts.contractSymbols.IStateService)
    public stateService: contracts.IStateService<TUserState, TConversationState>
    
    
}


