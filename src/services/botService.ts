

import { injectable, inject } from "inversify";
import * as contracts from "../contract/contracts";
import { serviceBase } from "./serviceBase";
import * as builder from 'botbuilder';

@injectable()
export class botService extends serviceBase implements contracts.IBotService {
 
    private _hostService: contracts.IHostService;

    private _bot: builder.UniversalBot;

    constructor(@inject(contracts.contractSymbols.IHostService) hostService: contracts.IHostService) {
        super();

        this._hostService = hostService;        
    }    

    public boot(){

        var connector = new builder.ChatConnector({
            appId: this.config.microsoftAppId,
            appPassword: this.config.microsoftAppPassword
        });

        this._hostService.init(connector);   

        this._bot = new builder.UniversalBot(connector, (session, args, next) => {
            session.endDialog(`I'm sorry, I did not understand '${session.message.text}'.\nType 'help' to know more about me :)`);
        });            
    }
}