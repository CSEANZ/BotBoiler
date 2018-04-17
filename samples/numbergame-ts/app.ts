import * as BotBoiler from '../../src/botboiler';

import GuessBot, { GuessUser, GuessConverstaion, botSymbols } from "./guessBot";
import * as dialogs from './dialogs/dialogIndex';

import * as topics from './topics/topics';

class app{
    protected _startup:BotBoiler.Startup;    

    constructor() {
        this._startup = new BotBoiler.Startup()
        .UseState<GuessUser, GuessConverstaion>()        
        .UseStateStore<BotBoiler.MemoryStorageEx>(BotBoiler.MemoryStorageEx)        
        .UseConsoleHost()
        .UseTopics(topics)   
        .UseDialogs(dialogs)     
        .BindAll("dialogs", true, true, dialogs)
        .UseBot(GuessBot)
        .Bind(topics.guessTopic)
        .Boot();       
    }
}

var a = new app();
