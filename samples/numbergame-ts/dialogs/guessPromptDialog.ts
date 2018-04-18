import * as BotBoiler from '../../../src/botboiler';
import { DatetimePrompt, FoundDatetime, PromptValidator } from 'botbuilder-dialogs';
import { TurnContext } from 'botbuilder';


@BotBoiler.injectable()
export default class implements BotBoiler.Contracts.IDialog {

    public id: string = "guessPrompt";
    public trigger: string = "";

    @BotBoiler.Decorators.BoilerNumberPrompt
    public async prompt(context: TurnContext,
        value: number): Promise<number> {
            if(value > 10 || value < 0){
                await context.sendActivity("Nope - not in range");
                return undefined;
            }
            return value;
    }
}