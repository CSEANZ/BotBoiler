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
        this.waterfall.push(this.step1.bind(this));
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

    step1(session: builder.Session, args:any, next:Function) {
        if(this._dialog.initialSay){
            session.send(this._dialog.initialSay);
        }
    }
}