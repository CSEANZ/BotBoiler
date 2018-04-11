import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter, TurnContext } from 'botbuilder';
import { botStateBase } from './botStateBase';
import { DialogSet, DialogContext, SkipStepFunction, DatetimePrompt } from 'botbuilder-dialogs';
import { DecoratorManager, DecoratorTypes, PromptTypes } from '../dialogs/decoratorManager';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export default abstract class BotService<TUserState, TConversationState>
    extends botStateBase<TUserState, TConversationState>
    implements contracts.IBotService {

    @inject(contracts.contractSymbols.IHostService)
    public hostService: contracts.IHostService<TUserState, TConversationState>;

    @inject(contracts.contractSymbols.IStateService)
    public stateService: contracts.IStateService<TUserState, TConversationState>;

    @inject("Factory<IDialog>")
    public dialogFactory: () => contracts.IDialog;

    private _dialogs: contracts.IDialog;
    private _dialogSet = new DialogSet();

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

        this.createDialogs()

        this.hostService.init(
            [               
                this.botCallback.bind(this)
            ]);
    }

    protected async runDialogs(context: TurnContext, intent: string): Promise<boolean> {

        try{
            var convState: any = this.stateService.getConversationState(context);

            const dc = this._dialogSet.createContext(context, convState);
    
            if(dc.instance){
                await dc.continue();
                // if(context.responded)
                // {
                    
                // }
                return true;
            }

            for (var i in this._dialogs) {
                var dialog: any = this._dialogs[i];
                var trigger = dialog.trigger;
                console.log("Cfg: " + dialog._boilerconfig);
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
            var dialog: any = this._dialogs[i];
            
            if(dialog.waterfall){
                this._dialogSet.add(dialog.id, dialog.waterfall);
            }else if(dialog.dialog){
                console.log(dialog.dialog);
                this._dialogSet.add(dialog.id, dialog.dialog);
            }else{
                console.log(`**** warning dialog: ${i} does not implement waterfall or dialog`);
            }

            
        }
    }

    abstract botCallback(context: TurnContext): void;
}


