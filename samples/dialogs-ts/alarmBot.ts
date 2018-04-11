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


function someDecorator(target, key, descriptor){  
    console.log(target);
    console.log(key);

    target[`key_${key}`] = "sdkljfsdjkldjklfsfdjkl";
    target.isThing = "Jordan";
}

@BotBoiler.injectable()
export default class alarmBot extends 
    BotBoiler.BotService<AlarmUser, AlarmConversation> {
    
    constructor(
        
    ) {
        super();
       
    }

    @someDecorator
    public desc(value:string){
        console.log("This is in the regular function: " + value);
    }

    public boot() {
        super.boot();
    }

    public async botCallback(context: BotBoiler.BotBuilder.TurnContext) {
        if (context.activity.type === 'message') {
            const utterance = (context.activity.text || '').trim().toLowerCase();
            
            try{
                var dialogResult:boolean = await this.runDialogs(context, utterance);
            }catch(e)
            {
                console.log(e);
            }
            
            
            console.log(dialogResult);
           
            //     var state = this.stateService.getConversationState(context);

            // const count = state.count === undefined ? state.count = 0 : ++state.count;

            // await context.sendActivity(`${count} You said Jordan "${context.activity.text}"`);
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }
}