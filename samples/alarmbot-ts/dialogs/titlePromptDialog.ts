import * as BotBoiler from '../../../src/botboiler';
import { TextPrompt } from 'botbuilder-dialogs';
import { TurnContext } from 'botbuilder';


@BotBoiler.injectable()


export default class implements BotBoiler.Contracts.IDialog{
    
    public id: string = "titlePrompt";   
  
    @BotBoiler.Decorators.BoilerTextPrompt
    public async prompt(
            context:TurnContext, 
            value:any):Promise<any>{                
                
        if (!value || value.length < 3) {
            await context.sendActivity(`Title should be at least 3 characters long.`);
            return undefined;
        } else {
            return value.trim();
        }
    }
}