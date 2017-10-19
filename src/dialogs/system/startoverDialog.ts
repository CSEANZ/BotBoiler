import * as builder from 'botbuilder';
import { injectable, inject } from 'inversify';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts from '../../system/contract/contracts';

/**
* A bot dialog
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

    /**
    * 
    */
    constructor() {
        super();
    }

    /**
    * Step 1
    * @param  {builder.Session} session
    * @param  {any} args
    * @param  {Function} next
    */
    private step1(session: builder.Session, args: any, next: Function) {
        builder.Prompts.confirm(session, `Are you sure?`);
    }

    private step2(session: builder.Session, args: any, next: Function) {

        if (args.response) {

            if (session.userData && session.userData.brokerId) {
                session.userData.brokerId = null;
            }
            if (session.privateConversationData && session.privateConversationData.appId) {
                session.privateConversationData.appId = null;
            }
            session.endConversation("starting over ....");
        }
        else {
            session.endDialogWithResult({ response: null });
        }

    }
}
