import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import Startup from '../src/system/startup';

export class testBase{
    
    protected _startup:Startup;

    constructor() {
        this._startup = new Startup();        
    }

    public resolve<T>(symbol:symbol){
        return this._startup.Resolve<T>(symbol);
    }
    public resolveDialog<T>(dialog:string){
        return this._startup.container.getNamed<T>("dialog", dialog);
    }

    // public getSession():builder.Session{
    //     var session = sinon.createStubInstance(builder.Session);
    //     session.dialogData = ()=>{};
    //     sinon.spy(session, "dialogData");

    //     return session;
    // }
}