

import test, { TestContext } from 'ava';
import { testBase } from '../testBase';
import { MemoryStorage } from 'botbuilder';


interface Alarm {
    title: string;
    time: string;
}

interface AlarmConversation {
    topic?: string;
    alarm?: Partial<Alarm>;
    prompt?: string;
}

interface AlarmUser {
    alarms: Alarm[];
}


class testClass extends testBase{
    /**
     *
     */
    constructor() {
        super();
        this._configureStartup();
    }

    private _configureStartup(){

        this._startup.UseState<AlarmUser, AlarmConversation>()        
        .UseStateStore<MemoryStorage>(MemoryStorage);
    }

    test_can_build_and_resolve_memory(t:TestContext){
       var bs = this._startup.botService;

       bs.boot();

       
    }
}

var t = new testClass();
test(t.test_can_build_and_resolve_memory.bind(t));
