import { injectable, inject } from "inversify";
import * as builder from 'botbuilder';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts  from '../../system/contract/contracts';
import dynamicDialogBase from './dynamicDialogBase';

/**
 * dataDialog is a dialog that can take external configuration to build a waterfall bot dialog, 
 * as opposed to having to code each step. This allows external configuration of conversations
 * via a graphical tool for example. 
 * 
 */
@injectable()
export default class dataDialog extends dynamicDialogBase{    
    name: string = "dataDialog";
    private _dialog:contracts.graphDialog;
    private _netClient:contracts.INetClient
    /**
     *
     */
    constructor(@inject(contracts.contractSymbols.INetClient) netClient:contracts.INetClient) {
        super();
        this._netClient = netClient;
        this.waterfall = new Array<builder.IDialogWaterfallStep>();
    }
    /**
     * Take the dialog config and build out the waterfall steps to make it real
     * @param  {contracts.graphDialog} dialog
     * @returns boolean
     */
    public init(dialog:contracts.graphDialog):boolean{
        
        this._dialog = dialog;
        
        this.id = dialog.id;

        if(dialog.triggerRegex){
            this.trigger = dialog.triggerRegex;
        }

        if(dialog.triggerText){
            this.trigger = dialog.triggerText;            
        }        

        this.setupSteps();

        return this.validate();
    }

    
    /**
     * Build the waterfall steps based on the data in the configuration
     */
    private setupSteps(){
        if(this._dialog.initialSay){
            var initial = this.initialStep();
            this.waterfall.push(initial.bind(this));
        }    

        //loop the data fields and create collection steps for each
        let previousFieldName:string = null;

        if(this._dialog.data && this._dialog.data.fields && this._dialog.data.fields.length > 0){
            for(let i in this._dialog.data.fields){
                let field = this._dialog.data.fields[i];

                let step: builder.IDialogWaterfallStep = null;

                if(field.choice && field.choice.length > 0){
                    step = this.collectChoiceStep(field.entityName, field.promptText,field.choice, previousFieldName);
                }else{
                    step = this.collectDataStep(field.entityName, field.promptText, previousFieldName);
                }
               
                this.waterfall.push(step.bind(this));
                previousFieldName = field.entityName;
            }
        }       

        let step = this.executeUponDataStep(previousFieldName);
        this.waterfall.push(step.bind(this));
    }
    /**
     * Ensure the configuration is valid
     * @returns boolean
     */
    private validate():boolean{

        var hasError:boolean = false;        

        if(!this.id){
            this.validationError("Missing dialog id")
            hasError = true;
        }

        if(!this.trigger){
            this.logger.log("Missing trigger");
            hasError = true;
        }

        return hasError;
    }

    private validationError(error:string){
        var name = "unknown";
        if(this.name){
            name = this.name;
        }

        this.logger.log(`Dynamic dialog issue: ${error}`);
    }
    /**
     * Extracts the entities passed in from LUIS to the first waterfall step and 
     * makes them available on the session.dialogData object. 
     * @param  {builder.Session} session
     * @param  {any} args
     */
    private extractLuisEntity(session:builder.Session, args:any){

        if(!this._dialog.data || !this._dialog.data.fields || this._dialog.data.fields.length == 0){
            return;
        }

        if(!args || !args.intent || !args.intent.entities){
            return;
        }        

        for(let i in this._dialog.data.fields){
            let field = this._dialog.data.fields[i];
            let entity = builder.EntityRecognizer.findEntity(args.intent.entities, field.entityName);
            
            if(entity && entity.entity){
                session.dialogData[field.entityName] = entity.entity;
            }
        }         
    }
    
    /**
     * Starting point for all dialog interaction. Hands off to next item configured in the waterfall
     */
    initialStep(){
        return (session: builder.Session, args:any, next:Function) => {
            if(this._dialog.initialSay){
                session.send(this._dialog.initialSay);  
            }
            
            if(this._dialog.isLuis){
                this.extractLuisEntity(session, args);
            }
            
            next();
        };
    } 

    private _setPreviousStep(session: builder.Session, results:builder.IDialogResult<string>, previousFieldName?:string){
        if(previousFieldName && results && results.response){

            var res = JSON.stringify(results.response);

            console.log(res);

            let data:any = results.response;

            if(data.entity){
                data = data.entity;
            }

            session.dialogData[previousFieldName] = data;
            session.send(`Setting ${previousFieldName} to ${data}`);
        }
    }

    collectChoiceStep(fieldName:string, promptText:string, choice:string[], previousFieldName?:string){
        return (session: builder.Session, results:builder.IDialogResult<string>, next:Function) =>{
            this._setPreviousStep(session, results, previousFieldName);

            if(!session.dialogData[fieldName]){                
                builder.Prompts.choice(session, promptText, choice);
            }else{
                next();
            }
        }
    }

    /**
     * Collect missing data that was not yet available in the session dialogData
     * @param  {string} fieldName
     * @param  {string} promptText
     * @param  {string} previousFieldName? - the field that was potentially asked for in the previous step by a prompt (so needs to be set this step)
     */
    collectDataStep(fieldName:string, promptText:string, previousFieldName?:string){
        return (session: builder.Session, results:builder.IDialogResult<string>, next:Function) =>{
            
            this._setPreviousStep(session, results, previousFieldName);
            
            if(!session.dialogData[fieldName]){                
                builder.Prompts.text(session, promptText);
            }else{
                next();
            }
        };
    }
    /**
     * Runs after other data collection steps to collage and execute upon the data that has been collected from the user. 
     * @param  {string} previousFieldName?
     */
    executeUponDataStep(previousFieldName?:string){
        return async (session: builder.Session, results:builder.IDialogResult<string>, next:Function) =>{
            
            this._setPreviousStep(session, results, previousFieldName);

            if(this._dialog.action){
                var action = this._dialog.action;

                if(action.serviceUrlAfter){                   

                    var result = await this._netClient.postJson<any, contracts.serviceResult>(action.serviceUrlAfter, "", session.dialogData);
                    if(result.text){
                        session.send(result.text);
                    }
                }
            }

            session.endDialog(`Okay ended the dialog with ${session.dialogData[previousFieldName]}`);
        };
    }

}