import "reflect-metadata";
import { Container } from "inversify"
import { ILogService, contractSymbols, IHostService, IBotService } from "./contract/contracts";

import { logService } from "./services/system/logService";
import { serverHelper } from "./helpers/serverHelper";
import { localHostService } from "./services/system/host/localHostService";
import { IConfig, serverTypes } from "./contract/systemEntities";
import { botService } from "./services/botService";

export default class startup {

    public container: Container;
    private _config: IConfig;

    private _botService: IBotService;

    constructor() {
        this.container = new Container();

        this._setupSystemServices();
        this._setupHostService();

        //Your services registered here      
    }  

    public get botService():IBotService{
        return this.container.get<IBotService>(contractSymbols.IBotService);
    }

    private _prepConfig(): IConfig{
        
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

    private _setupHostService(){

        if(this._config.serverType == serverTypes.AzureFunctions){
            throw 'Not implemented';
        }else{
             this.container.bind<IHostService>(contractSymbols.IHostService)
                .to(localHostService);
        }            
    }

    private _setupSystemServices(){
        this.container.bind<IConfig>(contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());

        this.container.bind<ILogService>(contractSymbols.ILogService)
            .to(logService).inSingletonScope();

        this.container.bind<IBotService>(contractSymbols.IBotService)
             .to(botService).inSingletonScope();
        
    }


}

