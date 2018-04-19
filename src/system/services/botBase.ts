import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter, TurnContext, ConversationState, UserState } from 'botbuilder';
import BoilerBot from './boilerBot';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export default abstract class BotBase<TUserState, TConversationState> extends serviceBase {   

    @inject(contracts.contractSymbols.IStateService)
    public stateService: contracts.IStateService<TUserState, TConversationState>   
    
    private _bot: BoilerBot<TUserState, TConversationState>;

    private _conversationState: TConversationState;
    private _userState: TUserState;
    private _turnContext: TurnContext;

    public ContextConfig(context:TurnContext){
        this.Conversation = this.stateService.getConversationState(context);
        this.User = this.stateService.getUserState(context);
        this.Context = context;
    }

    public get Context():TurnContext{
        return this._turnContext;
    }

    public set Context(state: TurnContext){
        this._turnContext = state;
    }

    public get Conversation():TConversationState{
        return this._conversationState;
    }

    public set Conversation(state: TConversationState){
        this._conversationState = state;
    }

    public get User():TUserState{
        return this._userState;
    }

    public set User(state: TUserState){
        this._userState = state;
    }

    public set Bot(bot:BoilerBot<TUserState, TConversationState>){
        this._bot = bot;
    }

    public get Bot():BoilerBot<TUserState, TConversationState>{
        return this._bot;
    }

   

}


