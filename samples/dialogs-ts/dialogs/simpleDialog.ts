import * as contracts from "../../../src/system/contracts/systemContracts";
import { 
    DialogContext 
} from 'botbuilder-dialogs';
import { TurnContext } from "botbuilder";

export default class simpleDialog implements contracts.IDialog{
    public id: string = "simpleDialog";
    public trigger: string = "trigger dialog";
    
    public get waterfall(): contracts.IDialogWaterfallStep[]{
        return [this.step1.bind(this), this.step2];
    }

    public step1(dc:DialogContext<TurnContext>){

    }

    public step2(dc:DialogContext<TurnContext>, args:any){
        
    }


}