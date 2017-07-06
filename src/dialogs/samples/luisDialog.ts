import { serviceBase } from './../../system/services/serviceBase';
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../../system/contract/contracts';

@injectable()
export default class luisDialog extends serviceBase implements contracts.IDialog{
    public id:string = 'luisDialog';
    public name:string ='luisDialog';
    public trigger:string = "SubmitTicket"

    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1.bind(this), this.step2];
    }

    step1(session: builder.Session, args:any, next:Function)  {
        
        //var sSession = JSON.stringify(session);
        //var sArgs = JSON.stringify(args);
        //this.logger.log(sArgs);
        
        const entity = builder.EntityRecognizer.findEntity(args.intent.entities, 'category');
        if(entity) next({ response: entity.entity });
        else builder.Prompts.text(session, 'Please provide entityName');
    }

    step2(session: builder.Session, results:builder.IDialogResult<string>, next:Function) {
                session.endConversation(`You said ${results.response}`);
    }
}