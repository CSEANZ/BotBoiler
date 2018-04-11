import * as BotBoiler from '../../src/botboiler';

import alarmBot, {AlarmUser, AlarmConversation, alarmBotSymbols } from "./alarmBot";
import titlePromptDialog from "./dialogs/titlePromptDialog";

import * as dialogs from './dialogs/dialogIndex';

class app{
    protected _startup:BotBoiler.Startup;    

    constructor() {
  
        this._startup = new BotBoiler.Startup()
        .UseState<AlarmUser, AlarmConversation>()        
        .UseStateStore<BotBoiler.MemoryStorageEx>(BotBoiler.MemoryStorageEx)        
        .UseConsoleHost()
        .UseDialogs(dialogs)
        .BindNamed(titlePromptDialog, alarmBotSymbols.topics, "titlePrompt")
        // .Bind(cancel)
        // .BindNamed(deleteAlarm, alarmBotSymbols.topics, "deleteAlarms")
        // .Bind(showAlarms)
         .UseBot(alarmBot)
        .Boot();       
    }
}

var a = new app();
