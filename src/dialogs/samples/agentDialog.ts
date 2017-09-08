import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../../system/contract/contracts';

import * as routerContracts from '../../system/router/routerContracts';

@injectable()
export default class agentDialog implements contracts.IDialog{
    
    private _router : routerContracts.IRouter;

    constructor(@inject(routerContracts.modelSymbols.IRouter) router: routerContracts.IRouter) {
        this._router = router;
    }
    
    public id:string = 'agentDialog';
    public name:string ='agentDialog';
    public trigger:RegExp =/^\/agent login/i;
    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1.bind(this)];
    }

    private step1(session, args, next){
        
        session.conversationData.isAgent = true;
        var pending = this._router.Pending();

        session.endDialog(`Welcome back human agent, there are ${pending} users waiting in the queue.\n\nType _agent help_ for more details.`);

    }

}