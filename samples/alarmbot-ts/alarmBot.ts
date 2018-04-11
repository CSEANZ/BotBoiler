import * as BotBoiler from '../../src/botboiler';

import cancel from "./topics/cancel";
import showAlarms from "./topics/showAlarms";

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
export default class AlarmBot extends BotBoiler.BotService<AlarmUser, AlarmConversation> {

    
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
            
            await context.sendActivity("Testing 123");
            //var result = await this.runTopics(context, utterance);
            var result = true;
            var noRun = await this.noRun();
            if(!result){
                await context.sendActivity("Hi there, I'm Alarmy.");
            }else{
                await context.sendActivity("...");
            }
        
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }
}