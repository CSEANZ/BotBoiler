import * as BotBoiler from '../../src/botboiler';

import BuyBot, { BotConvState, BotUserState, botSymbols } from "./buyBot";
import * as dialogs from './dialogs/dialogIndex';

import * as topics from './topics/topics';
import collectFormItemDialog from './dialogs/collectFormItemDialog';

class app{
    protected _startup:BotBoiler.Startup;    

    constructor() {
        this._startup = new BotBoiler.Startup()
        .UseState<BotUserState, BotConvState>()        
        .UseStateStore<BotBoiler.MemoryStorageEx>(BotBoiler.MemoryStorageEx)        
        .UseConsoleHost()
        .UseTopics(topics)   
        .UseDialogs(dialogs)     
        .BindAll("dialogs", true, true, dialogs)
        .UseBot(BuyBot)
        .Bind(topics.buyTopic)
        .Bind(dialogs.textPromptDialog)
        .Bind(collectFormItemDialog)
        .Boot();       
    }
}

var a = new app();
