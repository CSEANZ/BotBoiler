import { serviceBase } from "../src/system/services/serviceBase";
import * as contracts from "../src/system/contracts/systemContracts";
import { inject, injectable } from "inversify";


export interface Alarm {
    title: string;
    time: string;
}

export interface AlarmConversation {
    topic?: string;
    alarm?: Partial<Alarm>;
    prompt?: string;
}

export interface AlarmUser {
    alarms: Alarm[];
}


@injectable()
export default class AlarmBot extends serviceBase implements contracts.IBotService {
    
    private _hostService : contracts.IHostService<AlarmUser, AlarmConversation>   

    /**
     *
     */
    constructor(
        @inject(contracts.contractSymbols.IHostService)
        hostService : contracts.IHostService<AlarmUser, AlarmConversation>
    ) {
        super();
        

        this._hostService = hostService;
    }
    
    public boot(){
        this._hostService.init();
    }
}