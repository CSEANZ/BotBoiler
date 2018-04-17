import * as BotBoiler from '../../../src/botboiler';
import * as guessBot from "../guessBot";





export default class guessTopic extends
    BotBoiler.BotBase<guessBot.GuessUser, guessBot.GuessConverstaion>
    implements BotBoiler.Contracts.ITopic {

    id: string = 'guessTopic';
    trigger: RegExp = /guess/i;

    private _collectGuessDialog: BotBoiler.Contracts.IDialog;
    /**
     *
     */
    constructor(
        @BotBoiler.inject("dialogs") @BotBoiler.named("collectGuessDialog")
        alarmDialog: BotBoiler.Contracts.IDialog) {
        super();

        this._collectGuessDialog = alarmDialog;
    }

    @BotBoiler.Decorators.Topic
    public async begin(context: BotBoiler.BotBuilder.TurnContext): Promise<boolean> {
        // Set topic and initialize empty alarm
        const conversation = this.stateService.getConversationState(context);

        conversation.guesscount = 0;
        conversation.guesstargetnumber = 5;
        conversation.currentguess = 0;

        // Prompt for first field
        return await this.nextField(context);
    }

    @BotBoiler.Decorators.Topic
    public async routeReply(context: BotBoiler.BotBuilder.TurnContext): Promise<boolean> {

        const conversation = this.Conversation;
        return await this.nextField(context);
    }

    async nextField(context: BotBoiler.BotBuilder.TurnContext): Promise<boolean> {
        // Prompt user for next missing field
        const conversation: guessBot.GuessConverstaion = this.stateService.getConversationState(context);
        conversation.guesscount++;


        if (conversation.currentguess) {
            if (conversation.currentguess != conversation.guesstargetnumber) {
                await context.sendActivity("That's not correct");
            }else{
                await context.sendActivity("You got it");
                return false;
            }
        }

        if (conversation.guesscount > 3) {
            await context.sendActivity(`No more guesses! The correct number was ${conversation.guesstargetnumber}`)
            return false;
        }

        await this.Bot.RunDialog(this._collectGuessDialog, context);

        return true;
    }

}