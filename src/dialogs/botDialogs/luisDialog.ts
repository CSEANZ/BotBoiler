import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../../contract/contracts';

@injectable()
export default class luisDialog implements contracts.IDialog{
    public id:string = 'luisDialog';
    public name:string ='luisDialog';
    public trigger:string = "SubmitTicket"
    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1, this.step2];
    }

    step1(session, args, next)  {
        const entity = builder.EntityRecognizer.findEntity(args.entities, 'entity');
        if(entity) next({ response: entity.entity });
        else builder.Prompts.text(session, 'Please provide entityName');
    }
    step2(session, results, next) {
        session.endConversation(`You said ${results.response}`);
    }
}

