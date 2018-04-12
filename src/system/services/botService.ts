import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter, TurnContext } from 'botbuilder';
import BotStateBase from './botStateBase';
import { DialogSet, DialogContext, SkipStepFunction, DatetimePrompt } from 'botbuilder-dialogs';
import { DecoratorManager, DecoratorTypes, PromptTypes } from '../dialogs/decoratorManager';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export default abstract class BotService<TUserState, TConversationState>
    extends BotStateBase<TUserState, TConversationState>
    implements contracts.IBotService {

    @inject(contracts.contractSymbols.IHostService)
    public hostService: contracts.IHostService<TUserState, TConversationState>;

    @inject(contracts.contractSymbols.IStateService)
    public stateService: contracts.IStateService<TUserState, TConversationState>;

    @inject("Factory<IDialog>")
    public dialogFactory: () => contracts.IDialog;

    @inject("Factory<ITopic>")
    public topicFactory: () => contracts.ITopic;

    private _dialogs: contracts.IDialog;
    private _dialogSet = new DialogSet();

    private _topics: contracts.ITopic;

    /**
     *
     */
    constructor() {
        super();
    }
    /**
    * Boot the bot - creates a connector, bot and registers the dynamic dialogs. 
    */

    public boot() {

        this.createTopics();

        this.createDialogs()

        this.hostService.init(
            [               
                this.botCallback.bind(this)
            ]);
    }

    private createTopics(){
        this._topics = this.topicFactory();
        for(var d in this._topics){
            var topic = this._topics[d];
            console.log(topic.id);
        }
    }
    
    protected async runTopics(context: TurnContext, intent: string){
        var convState: any = this.stateService.getConversationState(context);        
    
        for(var t in this._topics){
           
            var topic:contracts.ITopic = this._topics[t];

            var trigger = topic.trigger;  

            if(convState._botboiler && convState._botboiler.topic === topic.id){                
                await topic.routeReply(context);
                return true;
            }

            if (trigger) {    
                if (trigger instanceof RegExp) {
                    if (trigger.test(intent)) { 
                                               
                        await topic.begin(context);
                        return true;
                    }
                } else {
                    if (trigger == intent) {                        
                        await topic.begin(context);
                        return true;
                    }
                }
            }
        }
    }

    
    private _enableTopic(context: TurnContext, topicId:string){
        var convState: any = this.stateService.getConversationState(context); 
        
    }

    protected async runDialogs(context: TurnContext, intent: string): Promise<boolean> {

        try{
            var convState: any = this.stateService.getConversationState(context);

            const dc = this._dialogSet.createContext(context, convState);
    
            if(dc.instance){
                await dc.continue();
                if(context.responded)
                {                    
                    return true;
                }
                return false;                
            }

            for (var i in this._dialogs) {
                var dialog: any = this._dialogs[i];
                var trigger = dialog.trigger;
                
                if (trigger) {
    
                    if (trigger instanceof RegExp) {
                        if (trigger.test(intent)) {
                            await dc.begin(dialog.id);
                            return true;
                        }
                    } else {
                        if (trigger == intent) {
                            await dc.begin(dialog.id);
                            return true;
                        }
                    }
                }
            }
           
        }catch(e){
            console.log(e);
            throw e;
        }

        

        return false;
    }

    private _isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    private createDialogs() {

        this._dialogs = this.dialogFactory();

        for (var i in this._dialogs) {
            var dialog = this._dialogs[i];
           
            if(dialog.waterfall){
                this._dialogSet.add(dialog.id, dialog.waterfall);
            }else if(dialog.dialog){  
                var d = dialog.dialog;                 
                this._dialogSet.add(dialog.id, dialog.dialog);
            }else{
                console.log(`**** warning dialog: ${i} does not implement waterfall or dialog`);
            }

            
        }
    }

    abstract botCallback(context: TurnContext): void;
}


