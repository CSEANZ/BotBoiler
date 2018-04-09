import * as contracts from "../../../src/system/contracts/systemContracts";
import { 
    DialogContext, TextPrompt, Prompt 
} from 'botbuilder-dialogs';
import { TurnContext } from "botbuilder";

export default class  implements contracts.IDialog{
    public id: string = "simpleDialog";
    public trigger: string = "trigger dialog";
    
    public get waterfall(): Prompt<TurnContext>[]{
        return [new TextPrompt(this.prompt.bind(this))];
    }

    public async prompt(dc:DialogContext<TurnContext>, value:any){
        if (!value || value.length < 3) {
            await dc.context.sendActivity(`Title should be at least 3 characters long.`);
            return undefined;
        } else {
            return value.trim();
        }
    }
}