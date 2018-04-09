import { serviceBase } from "../src/system/services/serviceBase";
import * as contracts from "../src/system/contracts/systemContracts";
import { inject, injectable } from "inversify";
import { TurnContext } from "botbuilder";


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
export default class AlarmBot extends serviceBase implements contracts.IBotService {
    
    private _hostService : contracts.IHostService<AlarmUser, AlarmConversation>   
    private _stateService: contracts.IStateService<AlarmUser, AlarmConversation>
    /**
     *
     */
    constructor(
        @inject(contracts.contractSymbols.IHostService)
        hostService : contracts.IHostService<AlarmUser, AlarmConversation>,
        @inject(contracts.contractSymbols.IStateService)
        stateService: contracts.IStateService<AlarmUser, AlarmConversation>
    ) {
        super();       

        this._hostService = hostService;
        this._stateService = stateService;
    }
    
    public boot(){
        this._hostService.init(this.botCallback.bind(this));
    }

    public async botCallback(context:TurnContext){
        if (context.activity.type === 'message') {  
            
            var state = this._stateService.getConversationState(context);
            
            const count = state.count === undefined ? state.count = 0 : ++state.count;

            await context.sendActivity(`${count} You said Jordan "${context.activity.text}"`);
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }
}