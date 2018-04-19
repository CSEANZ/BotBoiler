import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter, TurnContext } from 'botbuilder';
import BotBase from './botBase';
import { DialogSet, DialogContext, SkipStepFunction, DatetimePrompt } from 'botbuilder-dialogs';
import { DecoratorManager, DecoratorTypes, PromptTypes } from '../dialogs/decoratorManager';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export default abstract class BoilerBot<TUserState, TConversationState>
    extends BotBase<TUserState, TConversationState>
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
    public DialogSet = new DialogSet();    

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

    private createTopics() {
        var topics = this.topicFactory();
        for (var d in topics) {
            var topic = topics[d];
            topic.Bot = this;
            console.log(topic.id);
        }
    }

    private _prepBot(botItem:any, context:TurnContext){
        if(botItem.ContextConfig){
            var cast:BotBase<TUserState, TConversationState> = botItem;
            cast.ContextConfig(context);
        }
    }

    protected async runTopics(context: TurnContext, intent: string) {
        var convState: any = this.stateService.getConversationState(context);
        var topics = this.topicFactory();
        
        for (var t in topics) {

            var topic: contracts.ITopic = topics[t];

            this._prepBot(topic, context);

            var trigger = topic.trigger;
           
            if (convState._botboiler && convState._botboiler.topic === topic.id) {
                const conversation = this.stateService.getConversationState(context);
              
                return await topic.routeReply(context);             
               
            }            

            if (trigger) {
              
                //console.log(`Match: ${trigger.test(intent)}`);
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

    public async RunDialog(dialog: any, context: TurnContext, force:boolean = false) {
        var convState: any = this.stateService.getConversationState(context);

        const dc = this.DialogSet.createContext(context, convState);

        if(!dc.instance || force){          
            await dc.begin(dialog.id, {jordan:true});
        }       
    }

    public async PromptDialog(dialog: contracts.IDialog, prompt:string, context: TurnContext) {
        var convState: any = this.stateService.getConversationState(context);

        const dc = this.DialogSet.createContext(context, convState);

        dc.prompt(dialog.id, prompt);
    }

    protected async runDialogs(context: TurnContext, intent: string): Promise<boolean> {

        try {
            var convState: any = this.stateService.getConversationState(context);

            const dc = this.DialogSet.createContext(context, convState);

            if (dc.instance) {
                  
                this._prepBot(dc.instance, context);
                await dc.continue();
                if (context.responded) {
                    return true;
                }
                return false;
            }

            for (var i in this._dialogs) {
                var dialog: any = this._dialogs[i];
                var trigger = dialog.trigger;
                this._prepBot(dialog, context);

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

        } catch (e) {
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
            dialog.Bot = this;
            if (dialog.waterfall) {
                this.DialogSet.add(dialog.id, dialog.waterfall);
            } else if (dialog.dialog) {
                var d = dialog.dialog;
                this.DialogSet.add(dialog.id, dialog.dialog);
            } else {
                console.log(`**** warning dialog: ${i} does not implement waterfall or dialog`);
            }


        }
    }

    abstract botCallback(context: TurnContext): void;
}


