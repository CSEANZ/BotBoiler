import * as BotBoiler from '../../../src/botboiler';
import { DatetimePrompt, FoundDatetime, PromptValidator } from 'botbuilder-dialogs';
import { TurnContext } from 'botbuilder';


@BotBoiler.injectable()
export default class implements BotBoiler.Contracts.IDialog {

    public id: string = "textPromptDialog";
    public trigger: string = "";

    @BotBoiler.Decorators.BoilerTextPrompt
    public async prompt(context: TurnContext,
        value: string): Promise<string> {            
            return value;
    }
}