import Startup from "../src/system/Startup";
import MemoryStorageEx from "../src/system/services/extensios/MemoryStorageEx";

import * as contracts from "../src/system/contracts/systemContracts";

import AlarmBot, { AlarmUser, AlarmConversation } from "./alamBot";
import addAlarm from "./topics/addAlarm";

class app{
    protected _startup:Startup;

    constructor() {
        this._startup = new Startup()
        .UseState<AlarmUser, AlarmConversation>()        
        .UseStateStore<MemoryStorageEx>(MemoryStorageEx)        
        .UseConsoleHost()
        .BindNamed(addAlarm, "topics", "addAlarm")
        .UseBot(AlarmBot)
        .Boot();       
    }
}

var a = new app();
