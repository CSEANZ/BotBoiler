import "reflect-metadata";
import { Container, interfaces } from "inversify"
import * as contracts from "./contract/contracts";

import { logService } from "./services/system/logService";
import { serverHelper } from "./helpers/serverHelper";
import { localHostService } from "./services/system/host/localHostService";
import { IConfig, serverTypes } from "./contract/systemEntities";
import { botService } from "./services/botService";
import * as dialogs from "./dialogs/dialogIndex";

export default class startup {

    public container: Container;
    private _config: IConfig;

    private _botService: contracts.IBotService;

    constructor() {
        this.container = new Container();

        this._setupSystemServices();
        this._setupHostService();
        this._registerDialogs();
        this._registerDialogFactor();
        //Your services registered here   
    }

    public get botService(): contracts.IBotService {
        return this.container.get<contracts.IBotService>(contracts.contractSymbols.IBotService);
    }

    private _registerDialogFactor(){
        this.container.bind<interfaces.Factory<contracts.IDialog>>("Factory<IDialog>").toFactory<contracts.IDialog[]>((context: interfaces.Context) => {
            return () => {
                return context.container.getAll<contracts.IDialog>("dialog");                
            };
        });
    }

    private _registerDialogs() {
        var ds = dialogs;

        for (var i in dialogs) {

            var dialog = dialogs[i];

            if (typeof dialog == "function") {
                this.container.bind<contracts.IDialog>("dialog")
                    .to(dialog).whenTargetNamed(i);
            }
        }

        // var all = this.container.getAll<contracts.IDialog>("dialog");

        // var me = all[0].id;

        // var d = this.container.getNamed<contracts.IDialog>("dialog", "someBasicDialog");

        // var me2 = d.id;
        // var r = d.id;
    }

    private _setupHostService() {

        if (this._config.serverType == serverTypes.AzureFunctions) {
            throw 'Not implemented';
        } else {
            this.container.bind<contracts.IHostService>(contracts.contractSymbols.IHostService)
                .to(localHostService);
        }
    }

    private _setupSystemServices() {
        this.container.bind<IConfig>(contracts.contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());

        this.container.bind<contracts.ILogService>(contracts.contractSymbols.ILogService)
            .to(logService).inSingletonScope();

        this.container.bind<contracts.IBotService>(contracts.contractSymbols.IBotService)
            .to(botService).inSingletonScope();
    }

    private _prepConfig(): IConfig {

        var sh = new serverHelper();

        this._config = {
            port: process.env.port || process.env.PORT || 3978,
            microsoftAppId: process.env.MICROSOFT_APP_ID,
            microsoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
            luisModelUrl: process.env.LUIS_MODEL_URL,
            serverType: sh.getServerType()
        }

        return this._config;
    }
}