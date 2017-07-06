import { serviceBase } from './../../system/services/serviceBase';
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../../system/contract/contracts';

import * as modelContracts from '../../model/modelContracts';

@injectable()
export default class qnaDialog extends serviceBase implements contracts.IDialog{
    public id:string = 'qnaDialog';
    public name:string ='qnaDialog';
    public trigger:RegExp = /^askquestion$/i

    private _qnaMaker: modelContracts.IQnaComponent; 

    constructor(@inject(modelContracts.modelSymbols.IQnaComponent)qnaMaker: modelContracts.IQnaComponent) {
        super();        
        this._qnaMaker = qnaMaker;        
    }

    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1.bind(this), this.step2.bind(this)];
    }

    step1(session: builder.Session, args:any, next:Function)  { 
        session.send(`Hi there! I'm boiler bot`);
        builder.Prompts.text(session, `What would you like to know?`);       
    }

    async step2(session: builder.Session, results:builder.IDialogResult<string>, next:Function) {  
        var question = results.response;
        try{
            var result = await this._qnaMaker.getAnswer(question);
            if (result.score > 50) {
                session.endConversation(result.answer);
            } else if (result.score > 0) {
                session.send(`I'm not sure if this is right, but here's what I know...`);
                session.endConversation(result.answer);
            } else {
                session.endConversation(`I don't have that answer.`);
            }
        }catch(e)
        {
            session.endConversation(`Alas, I am broken.`);
            this.logger.log(e);
        }  
    }
}