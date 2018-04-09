import Startup from "../src/system/Startup";
import MemoryStorageEx from "../src/system/services/extensios/MemoryStorageEx";

import * as contracts from "../src/system/contracts/systemContracts";

import AlarmBot, { AlarmUser, AlarmConversation } from "./alamBot";



class app{
    protected _startup:Startup;

    constructor() {
        this._startup = new Startup();       

        this._startup
        .UseState<AlarmUser, AlarmConversation>()        
        .UseStateStore<MemoryStorageEx>(MemoryStorageEx)
        .UseBot(AlarmBot)
        .UseConsoleHost();

        // var res = this._startup.Resolve<Storage>(contracts.contractSymbols.Storage);
        // var res2 = this._startup
        //     .Resolve<contracts.IStateService<AlarmUser, AlarmConversation>>(contracts.contractSymbols.IStateService);
        var bot = this._startup.botService;        
        bot.boot();
    }

}

var a = new app();
