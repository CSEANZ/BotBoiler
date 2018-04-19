import * as BotBoiler from '../../src/botboiler';

import BuyBot, { BotConvState, BotUserState, botSymbols } from "./buyBot";

import * as topics from './topics/topics';

class app{
    protected _startup:BotBoiler.Startup;    

    constructor() {
        this._startup = new BotBoiler.Startup()
        .UseState<BotUserState, BotConvState>()        
        .UseStateStore<BotBoiler.MemoryStorageEx>(BotBoiler.MemoryStorageEx)        
        .UseConsoleHost()
        .UseTopics(topics)   
        .Bind(topics.buyTopic)
        .UseBot(BuyBot)
        .Boot();       
    }
}

var a = new app();
