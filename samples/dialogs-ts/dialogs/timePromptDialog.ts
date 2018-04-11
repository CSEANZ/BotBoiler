import * as BotBoiler from '../../../src/botboiler';
import { DatetimePrompt, FoundDatetime, PromptValidator } from 'botbuilder-dialogs';
import { TurnContext } from 'botbuilder';


@BotBoiler.injectable()
export default class implements BotBoiler.Contracts.IDialog {

    public id: string = "timePrompt";
    public trigger: string = "";

    public get dialog(): BotBoiler.Contracts.IBotDialog {       
        var d = new DatetimePrompt(this.prompt);
        return d;
    }

    public async prompt(context:TurnContext,
        values: FoundDatetime[]) : Promise<Date>{
        try {
            
            if (!Array.isArray(values) || values.length < 0) { throw new Error('missing time') }
            if (values[0].type !== 'datetime') { throw new Error('unsupported type') }
            const value = new Date(values[0].value);
            if (value.getTime() < new Date().getTime()) { throw new Error('in the past') }
            return value;
        } catch (err) {
            await context.sendActivity(`Please enter a valid time in the future like "tomorrow at 9am" or say "cancel".`);
            return undefined;
        }
    }
}