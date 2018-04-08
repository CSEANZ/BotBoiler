import { inject } from "inversify";

import {
    ConversationState, UserState, MemoryStorage,
    BotContext, BotFrameworkAdapter, Storage, BotState
} from 'botbuilder';

import * as contracts from "../contracts/systemContracts";

export default class stateService<TUserState, TConversationState>{
    
    private _conversationState : ConversationState<TConversationState>;
    private _userState: UserState<TUserState>;
    
    /**
     *
     */
    
    constructor(
        @inject(contracts.contractSymbols.Storage)storage:Storage,
        @inject(contracts.contractSymbols.ConversationState)conversationState:ConversationState<TConversationState>,
        @inject(contracts.contractSymbols.UserState)userState:UserState<TUserState>,               
    ) {
        
    }
}