import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter, TurnContext } from 'botbuilder';
import BoilerBot from './boilerBot';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export default abstract class BotBase<TUserState, TConversationState> extends serviceBase {   

    @inject(contracts.contractSymbols.IStateService)
    public stateService: contracts.IStateService<TUserState, TConversationState>   
    
    private _bot: BoilerBot<TUserState, TConversationState>;

    public get Bot():BoilerBot<TUserState, TConversationState>{
        return this._bot;
    }

    public set Bot(bot:BoilerBot<TUserState, TConversationState>){
        this._bot = bot;
    }

}


