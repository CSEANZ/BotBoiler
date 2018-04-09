import "reflect-metadata";
import {
    ConversationState, UserState, MemoryStorage,
    BotFrameworkAdapter, Storage, BotState
} from 'botbuilder';

import { Container, interfaces } from "inversify"
import * as contracts from "./contracts/systemContracts";
import { configBase } from "./services/serviceBase";
import { serverHelper } from "./helpers/serverHelper";
import { logService } from "./services/logService";
import { botService } from "./services/botService";


import { consoleHostService } from "./services/hosting/consoleHostService";
import { IStorage } from "./services/extensios/MemoryStorageEx";
import stateService from "./services/stateService";

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
       
    }

    public get botService(): contracts.IBotService{
        return this.Resolve<contracts.IBotService>(contracts.contractSymbols.IBotService);
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

    public UseBot(botType: new()=> contracts.IBotService){
        this._container.bind<contracts.IBotService>(contracts.contractSymbols.IBotService)
        .to(botType)
        .inSingletonScope();
        
    return this;
    }

    public UseConsoleHost<TUser, TConversation>():Startup{
        this._container.bind<contracts.IHostService<TUser, TConversation>>(contracts.contractSymbols.IHostService)
        .to(consoleHostService);
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
    public UseStateStore<StorageType>(storeType: new()=> IStorage): Startup {
        this._container.bind<IStorage>(contracts.contractSymbols.Storage)
            .to(storeType);
            
        return this;
    }   

    public UseState<TUser, TConversation>(): Startup {
        
        this._container.bind<contracts.IStateService<TUser, TConversation>>(contracts.contractSymbols.IStateService)
            .to(stateService)
            .inSingletonScope();
            

        return this;
    }
   

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

    public Resolve<T>(symbol:symbol){
        return this._container.get<T>(symbol);
    }

   

    private _setupSystemServices() {
        this._container.bind<contracts.IConfig>(contracts.contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());

        this._container.bind<contracts.ILogService>(contracts.contractSymbols.ILogService)
            .to(logService).inSingletonScope();      
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

    /**
     * Property to access the IOC container
     * @returns Container
     */
    public get container():Container{
        return this._container;
    }
}