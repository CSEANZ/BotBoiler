import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts from '../../system/contract/contracts';

@injectable()
export default class someBasicDialog implements contracts.IDialog {

    public id: string = 'someBasicDialog';
    public name: string = 'someBasicDialog';
    public trigger: RegExp = /^help$/i;
    public triggerActionOptions: builder.ITriggerActionOptions = {
        matches: this.trigger,
        confirmPrompt: "This will start from the begining. Are you sure?",
       
    };


    public get waterfall(): builder.IDialogWaterfallStep[] {
        return [this.step1, this.step2, this.step3, this.step4];
    }

    private step1(session, args, next) {
        const botName = 'DemoBot';
        const description = 'Demonstrate good composition and injection!';
        
        session.send(`Hi there! I'm ${botName}`);
        session.send(`In a nutshell, here's what I can do:\n\n${description}`);
        let question=`What's your name?`;
        builder.Prompts.text(session, question,
        {
            maxRetries: 5,
            retryPrompt:'I didn\'t understand, '+ question

        });
    }

    private step2(session, results, next) {
        session.send(`Welcome, ${results.response}`);
        let question=`how old are you?`;
        builder.Prompts.number(session, question,
            {
                maxRetries: 3,
                retryPrompt:'I didn\'t understand, '+ question
    
            });
    }

    private step3(session, results, next) {
        session.send(`You are years ${results.response}`);
        let question=`what do you do?`;
        builder.Prompts.text(session, question,
        {
            maxRetries: 3,
            retryPrompt:'I didn\'t understand, '+ question

        });
    }
    private step4(session, results, next) {
        session.send(`you said, ${results.response}. thank you`);
        session.endDialog();

    }
}