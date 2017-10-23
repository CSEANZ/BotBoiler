import * as builder from 'botbuilder';
import { injectable, inject } from 'inversify';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts from '../../system/contract/contracts';

/**
* this dialog invokes when user types "start over" 
* it allows users to cancel the current conversation and start the new converstation 
* https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-manage-conversation-flow
*/
@injectable()
export default class startoverDialog extends serviceBase implements contracts.IDialog {

    public id: string = 'startover';
    public name: string = 'startover';
    public trigger: RegExp = /^start over$/i;
    public triggerActionOptions: builder.ITriggerActionOptions = {
        matches: this.trigger,
        onSelectAction: (session, args, next) => {
            session.beginDialog(args.action, args);
        }
    }


    public get waterfall(): builder.IDialogWaterfallStep[] {
        return [this.step1.bind(this), this.step2.bind(this)];
    }


    constructor() {
        super();
    }

    /**
    * asking user if they want to start over and reset the conversation
    * @param  {builder.Session} session
    * @param  {any} args
    * @param  {Function} next
    */
    private step1(session: builder.Session, args: any, next: Function) {
        builder.Prompts.confirm(session, `Are you sure?`);
    }


    /**
     * If user confirms to start over- ending the converstion and cleaing the states 
     * If user doesn't confirm - close the start over dialog without any action
     * @param  {builder.Session} session
     * @param  {any} args
     * @param  {Function} next
     */
    private step2(session: builder.Session, args: any, next: Function) {

        if (args.response) {

            session.send("sure, resetting the converstaion");

            //optional - cleaning the state  
            if (session.userData) {
                session.userData = {};
            }
            if (session.privateConversationData) {
                session.privateConversationData = {};
            }
            if (session.conversationData) {
                session.conversationData = {};
            }
            session.endConversation();
        }
        else {
            session.endDialogWithResult({ response: null });
        }

    }
}
