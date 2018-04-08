import "reflect-metadata";
import {
    ConversationState, UserState, MemoryStorage,
    BotContext, BotFrameworkAdapter, Storage, BotState
} from 'botbuilder';
import { Container, interfaces } from "inversify"
import * as contracts from "./contracts/systemContracts";
import { configBase } from "./services/serviceBase";
import { serverHelper } from "./helpers/serverHelper";
import { logService } from "./services/logService";
import { botService } from "./services/botService";

export default abstract class Startup {

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
    /**
     * 
     * 
     * @template T 
     * @returns {Startup} 
     * @memberof Startup
     */
    public ConfigureMiddleware<T>(): Startup {


        return this;
    }
    /**
     * Configure storage data type. Pass in instance or null to let the container
     * resolve your type
     * 
     * @template T 
     * @param {T} [storeInstance=null] 
     * @returns {Startup} 
     * @memberof Startup
     */
    public ConfigureStateStore<StorageType extends Storage = Storage>(storeType: new()=> StorageType): Startup {
        this._container.bind<StorageType>(contracts.contractSymbols.Storage)
            .to(storeType)
            .inSingletonScope();
        return this;
    }

    public ConfigureUserState<T>(): Startup {

        return this;
    }

    public ConfigureConversationState<T>(): Startup {
        
        var state = new ConversationState<T>(new MemoryStorage());
        
        this._container.bind<ConversationState<T>>()
            .to(new ConversationState<T>(new MemoryStorage()))
            .inSingletonScope();

    }

    private _conversationStateFactory(){
        this._container.bind<interfaces.Factory<contracts.IDialog>>("Factory<IDialog>")
            .toFactory<contracts.IDialog[]>((context: interfaces.Context) => {
                return () => {
                    return context.container.getAll<contracts.IDialog>("dialog");                
                };
        });   
    }

    this._container.bind<interfaces.Factory<contracts.IDialog>>("Factory<IDialog>")
            .toFactory<contracts.IDialog[]>((context: interfaces.Context) => {
                return () => {
                    return context.container.getAll<contracts.IDialog>("dialog");                
                };
        });   

    public BindType<TInterface>(classType: new()=> TInterface, symbol:symbol, singleton:boolean = false){
        var bind = this._container.bind<TInterface>(symbol)
            .to(classType)
            
        if(singleton){
            bind.inSingletonScope();
        }
    }

    public BindInstance<TInterface>(classType: TInterface, symbol:symbol, singleton:boolean = false){
        var bind = this._container.bind<TInterface>(symbol)
            .toConstantValue(classType);
    }

    private _setupDefaultBotServcies() {
        var storage: Storage = new MemoryStorage();
        var conversationState: BotState<BotConversationState>
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