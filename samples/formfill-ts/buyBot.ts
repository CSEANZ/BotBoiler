import * as BotBoiler from '../../src/botboiler';

let botSymbols = {
    topics: "topics"
}
export { botSymbols };

export interface buyForm{
    id: string,
    prompt: string,
    response: string,
    errorPrompt: string,
    choices?: string,
    type: string
}

export interface BotConvState {
    formfill:{},
    _conversationFlow:string,
    formTemplate:buyForm[]

}

export interface BotUserState {
   
    
}


@BotBoiler.injectable()
export default class BuyBot extends BotBoiler.BoilerBot<BotUserState, BotConvState> {

    
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