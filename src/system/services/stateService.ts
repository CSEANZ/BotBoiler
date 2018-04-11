import { inject, injectable } from "inversify";

import {
    ConversationState, UserState, MemoryStorage,
    BotFrameworkAdapter, Storage, BotState, TurnContext, BotStateSet
} from 'botbuilder';

import * as contracts from "../contracts/systemContracts";

import { IStorage } from "./extensios/MemoryStorageEx";

@injectable()
export default class StateService<TUserState, TConversationState> 
    implements contracts.IStateService<TUserState,TConversationState> {

    private _storage: IStorage;

    private _conversationState: ConversationState<TConversationState>;
    private _userState: UserState<TUserState>;

    constructor(@inject(contracts.contractSymbols.Storage) storage: IStorage) {
        
        this._storage = storage;
        this._conversationState = new ConversationState<TConversationState>(this._storage.Storage);
        this._userState = new UserState<TUserState>(this._storage.Storage);

        
    }

    public getBotStateSet() : BotStateSet{
        var stateSet = new BotStateSet();
        stateSet.use(this._conversationState, this._userState);
        return stateSet;
    }    

    public getUserState(context: TurnContext): TUserState {
        return this._userState.get(context);
    }

    public gu = this.getUserState;

    public getConversationState(context: TurnContext): TConversationState{        
        return this._conversationState.get(context);
    }

    public gc = this.getConversationState;


}