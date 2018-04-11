
import * as restify from 'restify';
import * as builder from 'botbuilder';
import { IHostService } from "../../contracts/systemContracts";
import { serviceBase, configBase } from "../serviceBase";
import { BotAdapter, ConsoleAdapter, BotStateSet, TurnContext } from 'botbuilder';
import * as contracts from "../../contracts/systemContracts";
import { inject, injectable } from 'inversify';

@injectable()
export class consoleHostService<TUserState, TConversationState> implements IHostService<TUserState, TConversationState> {
   

    private _stateService:contracts.IStateService<TUserState, TConversationState>;
    /**
     *
     */
    constructor(
        @inject(contracts.contractSymbols.IStateService)
        stateService : contracts.IStateService<TUserState, TConversationState>) {        
            this._stateService = stateService;       
    }

    init(callbacks:{ (context: TurnContext): void; } []){
       
        var adapter = new ConsoleAdapter();
        
        adapter.use(this._stateService.getBotStateSet());
      
        this.log("Local Context");        

        // Listen for incoming requests 
        adapter.listen(async (context) => {            
            for(var i in callbacks){
                callbacks[i](context);
            }            
        });
    }

    public log(message:string){
        console.log(message);
    }

    public get export():any{
        return null;
    }
}