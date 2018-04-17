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
        return value;
    }
}