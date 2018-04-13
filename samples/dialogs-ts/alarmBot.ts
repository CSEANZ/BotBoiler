import * as BotBoiler from '../../src/botboiler';


let alarmBotSymbols = {
    topics: "topics"
}

let alarmBotTopics = {
    topics: "topics"
}

export { alarmBotSymbols };

export interface Alarm {
    title: string;
    time: string;
}

export interface AlarmConversation {
    topic?: string;
    alarm?: Partial<Alarm>;
    prompt?: string;
    count: number;
}

export interface AlarmUser {
    alarms: Alarm[];
    count: number;
}

@BotBoiler.injectable()
export default class alarmBot extends 
    BotBoiler.BotService<AlarmUser, AlarmConversation> {
    
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
            
            try{
                var dialogResult:boolean = await this.runDialogs(context, utterance);
                if(!dialogResult){
                    context.sendActivity("I'm a simple alarm bot. But I'm composable, testable and injectable!")
                }
            }catch(e)
            {
                console.log(e);
            } 
           
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }
}