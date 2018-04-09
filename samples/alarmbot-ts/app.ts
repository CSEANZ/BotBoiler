import Startup from "../../src/system/Startup";
import MemoryStorageEx from "../../src/system/services/extensios/MemoryStorageEx";

import * as contracts from "../../src/system/contracts/systemContracts";

import AlarmBot, { AlarmUser, AlarmConversation, alarmBotSymbols } from "./alamBot";
import addAlarm from "./topics/addAlarm";
import cancel from "./topics/cancel";
import deleteAlarm from "./topics/deleteAlarm";
import showAlarms from "./topics/showAlarms";

class app{
    protected _startup:Startup;

    

    constructor() {
        this._startup = new Startup()
        .UseState<AlarmUser, AlarmConversation>()        
        .UseStateStore<MemoryStorageEx>(MemoryStorageEx)        
        .UseConsoleHost()
        .BindNamed(addAlarm, alarmBotSymbols.topics, "addAlarm")
        .Bind(cancel)
        .BindNamed(deleteAlarm, alarmBotSymbols.topics, "deleteAlarms")
        .Bind(showAlarms)
        .UseBot(AlarmBot)
        .Boot();       
    }
}

var a = new app();
