import * as BotBoiler from '../../src/botboiler';

let botSymbols = {
    topics: "topics"
}
export { botSymbols };

export interface Guess {
    guessnumber: string;    
}

export interface GuessConverstaion {
    topic?: string;
    guesstargetnumber?: number;
    currentguess?: number;
    guesscount: number;
}

export interface GuessUser {
   
    count: number;
}


@BotBoiler.injectable()
export default class GuessBot extends BotBoiler.BoilerBot<GuessUser, GuessConverstaion> {

    
    constructor(
        

    ) {
        super();

        
    }

    public boot() {
        super.boot();
    }

    public async botCallback(context: BotBoiler.BotBuilder.TurnContext) {
        if (context.activity.type === 'message') {
            const utterance = (context.activity.text || '').trim().toLowerCase();

            var resultDialogs = await this.runDialogs(context, utterance);
            
            if(result){
                return;
            }

            var result = await this.runTopics(context, utterance);
            
            if(!result){
                await context.sendActivity("Hi there, I'm Guessy.");
            }else{
                //await context.sendActivity("...");
            }
        
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }
}