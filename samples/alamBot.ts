import { serviceBase } from "../src/system/services/serviceBase";
import * as contracts from "../src/system/contracts/systemContracts";
import { inject, injectable, named } from "inversify";
import { TurnContext } from "botbuilder";
import { botService } from "../src/system/services/botService";


export interface Alarm {
    title: string;
    time: string;
}

export interface AlarmConversation {
    topic?: string;
    alarm?: Partial<Alarm>;
    prompt?: string;
    count:number;
}

export interface AlarmUser {
    alarms: Alarm[];
    count:number;
}


@injectable()
export default class AlarmBot extends botService<AlarmUser, AlarmConversation> {   
      
    private _addAlarm:contracts.ITopic

    constructor(
        @inject("topics") @named("addAlarm") addAlarm:contracts.ITopic
    ) {
        super();

        this._addAlarm = addAlarm;
    }   

    public boot(){
        super.boot();
    }

    public async botCallback(context:TurnContext){
        if (context.activity.type === 'message') {  
            const utterance = (context.activity.text || '').trim().toLowerCase();
            if (utterance.includes('add alarm')) {
                await this._addAlarm.begin(context);
            }
            else{
                switch (this.stateService.getConversationState(context).topic) {  
                    case 'addAlarm':
                        await this._addAlarm.routeReply(context);
                        break;
                    default:
                    await context.sendActivity(`[${context.activity.type} event detected]`);
                }
            }
            //     var state = this.stateService.getConversationState(context);
            
            // const count = state.count === undefined ? state.count = 0 : ++state.count;

            // await context.sendActivity(`${count} You said Jordan "${context.activity.text}"`);
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }
}