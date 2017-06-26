
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contract/contracts";
import { serviceBase } from "./serviceBase";


@injectable()
export class botService extends serviceBase implements contracts.IBotService {

    private _hostService: contracts.IHostService;
    private _bot: builder.UniversalBot;
    private _dialogs: contracts.IDialog;

    constructor( @inject(contracts.contractSymbols.IHostService) hostService: contracts.IHostService,
        @inject("Factory<IDialog>") dialogs: () => contracts.IDialog) {
        super();

        this._dialogs = dialogs();
        this._hostService = hostService;        
    }    

    public boot() {

        var connector = new builder.ChatConnector({
            appId: this.config.microsoftAppId,
            appPassword: this.config.microsoftAppPassword
        });

        this._hostService.init(connector);

        this._bot = new builder.UniversalBot(connector, (session, args, next) => {
            session.endDialog(`I'm sorry, I did not understand '${session.message.text}'.\nType 'help' to know more about me :)`);
        });

        this._enableLuis();

        for (var i in this._dialogs) {
            var dialog: contracts.IDialog = this._dialogs[i];
            this._bot.dialog(dialog.id, dialog.waterfall).triggerAction({ matches: dialog.trigger });
        }        
    }

    private _enableLuis(){
        if(this.config.luisModelUrl && this.config.luisModelUrl.length > 0){
            var luisRecognizer = new builder.LuisRecognizer(this.config.luisModelUrl)
                .onEnabled(function (context, callback) {
                    var enabled = context.dialogStack().length === 0;
                    callback(null, enabled);
                });
            this._bot.recognizer(luisRecognizer);
        }
    }
}