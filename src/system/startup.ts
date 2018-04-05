import "reflect-metadata";
import { ConversationState, UserState, MemoryStorage, 
    BotContext, BotFrameworkAdapter, Storage, BotState } from 'botbuilder';
import { Container, interfaces } from "inversify"
import * as contracts from "./contracts/systemContracts";
import { configBase } from "./services/serviceBase";
import { serverHelper } from "./helpers/serverHelper";
import { logService } from "./services/logService";
import { botService } from "./services/botService";

export default class Startup {

    public _container: Container;
    private _config: contracts.IConfig;

    /**
     *
     */
    constructor() {
        this._container = new Container();
        configBase.Container = this._container;

        this._setupSystemServices();

        this.ConfigureMiddleware();
    }

    public ConfigureMiddleware(){
        
    }

    private _setupDefaultBotServcies(){
        var storage:Storage = new MemoryStorage();
        var conversationState:BotState<BotConversationState> 
            = new ConversationState<BotConversationState>(storage)
        this._container.bind<Storage>(contracts.contractSymbols.Storage)
        .toConstantValue(storage);
    }    

    private _setupSystemServices() {
        this._container.bind<contracts.IConfig>(contracts.contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());

        this._container.bind<contracts.ILogService>(contracts.contractSymbols.ILogService)
            .to(logService).inSingletonScope();

        this._container.bind<contracts.IBotService>(contracts.contractSymbols.IBotService)
            .to(botService).inSingletonScope();
    }

    private _prepConfig(): contracts.IConfig {

        var sh = new serverHelper();

        this._config = {
            port: process.env.port || process.env.PORT || "3978",
            microsoftAppId: process.env.MICROSOFT_APP_ID,
            microsoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
            luisModelUrl: process.env.LUIS_MODEL_URL,
            serverType: sh.getServerType(),
            qna_id: process.env.QNA_ID,
            qna_subs: process.env.QNA_SUBS_KEY
        }

        return this._config;
    }
}