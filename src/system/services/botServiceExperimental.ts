
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contract/contracts";
import { serviceBase } from "./serviceBase";

/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export class botService extends serviceBase implements contracts.IBotService {

    private _hostService: contracts.IHostService;
    private _bot: builder.UniversalBot;
    private _dialogs: contracts.IDialog;

    /**
     * 
     * @param  {} @inject(contracts.contractSymbols.IHostService
     * @param  {contracts.IHostService} hostService
     * @param  {} @inject("Factory<IDialog>"
     * @param  {()=>contracts.IDialog} dialogs
     */
    constructor( @inject(contracts.contractSymbols.IHostService) hostService: contracts.IHostService,
        @inject("Factory<IDialog>") dialogs: () => contracts.IDialog) {
        super();

        this._dialogs = dialogs();
        this._hostService = hostService;
    }

    /**
     * Boot the bot - creates a connector, bot and registers the dynamic dialogs. 
     */
    public boot() {

        var connector = new builder.ChatConnector({
            appId: this.config.microsoftAppId,
            appPassword: this.config.microsoftAppPassword
        });

        this._hostService.init(connector);

        this._bot = new builder.UniversalBot(connector, (session, args, next) => {
            session.endDialog(`I'm sorry, I did not understand '${session.message.text}'.\nType 'help' to know more about me :)`);
        });

        this._enableLuis();

        for (var i in this._dialogs) {
            var dialog: contracts.IDialog = this._dialogs[i];
            this._bot.dialog(dialog.id, dialog.waterfall).triggerAction(
                {
                    matches: dialog.trigger, 
                    onSelectAction: (session, args, next) => {
                        // Add the help dialog to the dialog stack 
                        // (override the default behavior of replacing the stack)
                        session.beginDialog(args.action, args);
                    }
                    });
                    
        }

        var dlThings: contracts.graphDialog[] = new Array<contracts.graphDialog>();
        dlThings.push(this.getStartOrderDialogData());
        dlThings.push(this.getOpeningTimesDialogData());


        for (let i in dlThings) {
            let dialogConfig = dlThings[i];
            let dDynamic: contracts.IDialog = this.resolve<contracts.IDialog>(contracts.contractSymbols.dataDialog);
            dDynamic.init(dialogConfig);
            let d = this._bot.dialog(dDynamic.id, dDynamic.waterfall).triggerAction(
                { 
                    matches: dDynamic.trigger, 
                    onSelectAction: (session, args, next) => {
                        // Add the help dialog to the dialog stack 
                        // (override the default behavior of replacing the stack)
                        session.beginDialog(args.action, args);
                    }
                });

                this._addActions(d, dialogConfig, dlThings);
        }
            console.log("****** setup");
    }

    private _addActions(dialog: builder.Dialog, currentDialogData: contracts.graphDialog, dialogs: contracts.graphDialog[]){
        for (let i in dialogs) {

            let dialogConfig = dialogs[i];
            
            if(currentDialogData === dialogConfig){
                continue;
            }

            var trigger:string|RegExp = (dialogConfig.triggerText || dialogConfig.triggerRegex);

            dialog.beginDialogAction(`${dialogConfig.id}_action`, dialogConfig.id, {
                matches: trigger
            });
        }
    }

    /**
     * If LUIS is present this will enable the LUIS Recognizer and apply it to the bot. 
     */
    private _enableLuis() {
        if (this.config.luisModelUrl && this.config.luisModelUrl.length > 0) {
            var luisRecognizer = new builder.LuisRecognizer(this.config.luisModelUrl)
                .onEnabled(function (context, callback) {                   
                    
                    var enabled = context.dialogStack().length === 0;
                    console.log("LUIS GOing");
                    callback(null, true);
                }).onFilter(function(context, result, callback) {
                    // If the "AskForWater" intent is returned from LUIS, the intent is changed to "Filtered".
                    if(result.score < .8){
                        callback(null, null);
                    }else{
                        callback(null, result);
                    }
                   
                })
            this._bot.recognizer(luisRecognizer);
        }
    }

    getTestDialogData(): contracts.graphDialog {

        var fields: contracts.dialogField[] = [{
            entityName: 'category',
            promptText: 'Please enter a category'
        }];

        var d: contracts.dialogData = {
            fields: fields
        }

        // var graphDialog: contracts.graphDialog = {
        //     isLuis: true,
        //     triggerText: 'SubmitTicket',
        //     id: 'submitTicketDialog',
        //     data: d,
        //     initialSay: 'Okay! So you want to submit a ticket hey? Lets get that sorted'
        // }

        var graphDialog: contracts.graphDialog = {
            isLuis: false,
            triggerRegex: /^subs$/i,
            id: 'submitTicketDialog',
            data: d,
            initialSay: 'Okay! So you want to submit a ticket hey? Lets get that sorted'
        }

        return graphDialog;
    }

    getOpeningTimesDialogData(): contracts.graphDialog {
        var fields: contracts.dialogField[] = [{
            entityName: 'postcode',
            promptText: 'Which post code?'
        }];

        var d: contracts.dialogData = {
            fields: fields
        }

        var graphDialog: contracts.graphDialog = {
            isLuis: true,
            triggerText: 'ShowOpeningTimes',
            id: 'openingTimesDialog',
            data: d,
            initialSay: `So you're looking for opening times.`,
            action: {
                serviceUrlAfter: "https://graphpizza.azurewebsites.net/api/OpeningTimes?code=LEg3pxudN1cxVi/aQvjx9IPQzy1bLJyqVqcfIW9iMVJh5BAdULXF6Q=="
            }
        }

        return graphDialog;
    }

    getStartOrderDialogData(): contracts.graphDialog {
        var fields: contracts.dialogField[] = [{
            entityName: 'deliveryMode',
            promptText: 'Would you like take away or home delivery?',
            choice: ["Home Delivery", "Pickup"]
        }];

        var d: contracts.dialogData = {
            fields: fields
        }

        var graphDialog: contracts.graphDialog = {
            isLuis: true,
            triggerText: 'StartOrder',
            id: 'startOrderDialog',
            data: d,
            initialSay: `Okay, let's get us some pizza!`
        }

        return graphDialog;
    }

    getInOrderDialogData(): contracts.graphDialog { 

        var graphDialog: contracts.graphDialog = {
            isLuis: true,
            triggerText: 'StartOrder',
            id: 'startOrderDialog',            
            initialSay: `Okay, let's get us some pizza!`,
            action:{
                serviceUrlText:"https://graphpizza.azurewebsites.net/api/OpeningTimes?code=LEg3pxudN1cxVi/aQvjx9IPQzy1bLJyqVqcfIW9iMVJh5BAdULXF6Q=="
            }
        }

        return graphDialog;
    }
}