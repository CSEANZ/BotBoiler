import { injectable } from "inversify";
import * as builder from 'botbuilder';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts  from '../../system/contract/contracts';

@injectable()
export default class dataDialog extends serviceBase implements contracts.IDialog{
    id: string;
    name: string;
    trigger: string | RegExp;
    
    waterfall: builder.IDialogWaterfallStep[]    

    private _dialog:contracts.graphDialog;

    /**
     *
     */
    constructor() {
        super();
        this.waterfall = new Array<builder.IDialogWaterfallStep>();
    }

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

    private setupSteps(){
        if(this._dialog.initialSay){
            var initial = this.initialStep();
            this.waterfall.push(initial.bind(this));
        }    
    }

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

    private extractLuisEntity(session:builder.Session, args:any){

        if(!this._dialog.data || !this._dialog.data.fields || this._dialog.data.fields.length == 0){
            return;
        }

        if(!args || !args.intent || !args.intent.entities){
            return;
        }

        for(let i in this._dialog.data.fields){
            let field = this._dialog.data.fields[i];
            let entity = builder.EntityRecognizer.findEntity(args.intent.entities, field.luisEntityName);
            if(entity){
                session.dialogData[field.luisEntityName] = entity;
            }
        }         
    }

    initialStep(){
        return (session: builder.Session, args:any, next:Function) => {
            if(this._dialog.initialSay){
                session.send(this._dialog.initialSay);  
            }
            
            if(this._dialog.isLuis){
                this.extractLuisEntity(session, args);
            }            
        }
    } 


}