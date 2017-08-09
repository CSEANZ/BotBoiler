import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../../system/contract/contracts';

@injectable()
export default class someBasicDialog2 implements contracts.IDialog{
    
    public id:string = 'someBasicDialog2';
    public name:string ='someBasicDialog2';
    public trigger:RegExp =/^another$/i
    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1, this.step2];
    }

    private step1(session, args, next){
        const botName = 'SecondDialog';
        const description = `This is a second dialog`;

        session.send(`Second ${botName}`);
        session.send(`Second\n\n${description}`);

        builder.Prompts.text(session, `What's your name22?`);
    }

    private step2(session, results, next){
        session.endDialog(`Welcome ending 2, ${results.response}`);
    }
}