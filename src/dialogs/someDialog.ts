import { serviceBase } from './../system/services/serviceBase';
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../system/contract/contracts';

@injectable()
export default class someDialog extends serviceBase implements contracts.IDialog{
    public id:string = 'someDialog';
    public name:string ='someDialog';
    public trigger:RegExp = /^somedialog$/i

    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1.bind(this), this.step2.bind(this)];
    }

    step1(session: builder.Session, args:any, next:Function)  { 
        session.send(`Hi there! I'm boiler bot`);
        builder.Prompts.text(session, `What's your name?`);       
    }

    step2(session: builder.Session, results:builder.IDialogResult<string>, next:Function) {          
        session.endConversation(`Welcome, ${results.response}`);     
    }
}