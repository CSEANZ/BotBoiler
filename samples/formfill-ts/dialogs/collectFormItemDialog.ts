import * as BotBoiler from '../../../src/botboiler';
import * as BuyBot from '../buyBot';
import { buyForm } from '../buyBot';

@BotBoiler.injectable()

export default class collectFormItemDialog 
    extends BotBoiler.DialogBase<BuyBot.BotUserState, BuyBot.BotConvState>{
        
    public id: string = "collectFormItemDialog";   
   
 
    /**
     *
     */
    constructor(
           ) {
        super();
       
      
    }

    // private _steps: BotBoiler.Contracts.IDialogWaterfallStep[];

    // public prepDialog(template:buyForm[]){
        
    //     for(var i in template){
    //         var templateItem = template[i];
    //         if(!templateItem.choices){
               
    //             var step1 = async (dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>)=>{
                   
    //                 await dc.prompt('textPromptDialog', templateItem.prompt);
    //             }
    //             step1 = step1.bind(this);
    //             this._steps.push(step1);

    //             var step2 = async (dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>, args:any)=>{
    //                 await dc.context.sendActivity(templateItem.response);
    //             }
    //             step2 = step2.bind(this);
    //             this._steps.push(step2);                
    //         }
    //     }
    // }

    public get waterfall(): BotBoiler.Contracts.IDialogWaterfallStep[]{
        
        return [this.step1.bind(this)];
    }
    
    public async step1(dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>, args:any){
        console.log(args);
        // //dc.instance.state = {} as GuessBot.Guess;
        // var result = await this._netClient.postJson("https://jsonplaceholder.typicode.com", "posts/1", {} );
        // console.log(result);
        // await dc.prompt('guessPrompt', `Please enter a number between 1 and 10...`);
    }
   
    // public async step2(dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>, args:any){
    //      // Save alarm title and prompt for time
    //     //  const guess = dc.instance.state as GuessBot.Guess;
    //     //  guess.guessnumber = args;

    //      const conversation = this.stateService.getConversationState(dc.context);         
    //      conversation.currentguess = args;

    //      await dc.end(); 
    // }

  
}