import * as BotBoiler from '../../../src/botboiler';
import * as GuessBot from '../guessBot';

@BotBoiler.injectable()

export default class collectGuessDialog 
    extends BotBoiler.DialogBase<GuessBot.GuessUser, GuessBot.GuessConverstaion>{
    
    public id: string = "collectGuessDialog";   
   
    public get waterfall(): BotBoiler.Contracts.IDialogWaterfallStep[]{
        return [this.step1.bind(this), this.step2.bind(this)];
    }    
    
    public async step1(dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>){
        //dc.instance.state = {} as GuessBot.Guess;
        await dc.prompt('guessPrompt', `Please enter a number between 1 and 10...`);
    }
   
    public async step2(dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>, args:any){
         // Save alarm title and prompt for time
        //  const guess = dc.instance.state as GuessBot.Guess;
        //  guess.guessnumber = args;

         const conversation = this.stateService.getConversationState(dc.context);         
         conversation.currentguess = args;

         await dc.end(); 
    }

  
}