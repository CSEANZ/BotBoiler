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
import BoilerBot from "./services/boilerBot";
import {netClient} from './helpers/netClient';


import { consoleHostService } from "./services/hosting/consoleHostService";
import { IStorage } from "./services/extensios/MemoryStorageEx";
import stateService from "./services/stateService";

export default class Startup {

    public _container: Container;
    private _config: contracts.IConfig;

    public static Container: Container;

    /**
     *
     */
    constructor() {
        this._container = new Container();

        this.BindInstance<Startup>(this, contracts.contractSymbols.Startup);

        Startup.Container = this._container;
        configBase.Container = this._container;
        this._setupSystemServices();
        this._registerDialogFactory();
    }

    public Boot(): Startup {
        this.Bot.boot();
        return this;
    }

    public get Bot(): contracts.IBotService {
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

    public UseBot(botType: new (...param: any[]) => contracts.IBotService) {
        this._container.bind<contracts.IBotService>(contracts.contractSymbols.IBotService)
            .to(botType)
            .inSingletonScope();

        return this;
    }

    public UseConsoleHost<TUser, TConversation>(): Startup {
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
    public UseStateStore<StorageType>(storeType: new () => IStorage): Startup {
        this._container.bind<IStorage>(contracts.contractSymbols.Storage)
            .to(storeType).inSingletonScope();

        return this;
    }

    public UseState<TUser, TConversation>(): Startup {

        this._container.bind<contracts.IStateService<TUser, TConversation>>(contracts.contractSymbols.IStateService)
            .to(stateService)
            .inSingletonScope();


        return this;
    }

    public UseDialogs(dialogs: {}): Startup {
        this.BindAll<contracts.IDialog>("IDialog", true, false, dialogs);
        return this;
    }

    public UseTopics(topics: {}): Startup {
        this.BindAll<contracts.ITopic>("ITopic", false, false, topics);
        return this;
    }

    public BindAll<T>(identifier: string, singleton: boolean, addFactory: boolean = false, items: {}): Startup {

        for (var i in items) {

            var dialog = items[i];

            if (typeof dialog == "function") {

                var binder = this._container.bind<T>(identifier).to(dialog);

                if (singleton) {
                    binder.inRequestScope();
                }

                binder.whenTargetNamed(i);

            }
        }
        if (addFactory) {
            this._container.bind<interfaces.Factory<contracts.IDialog>>(`Factory<${identifier}>`)
                .toFactory<T[]>((context: interfaces.Context) => {
                    return () => {
                        if (context.container.isBound(identifier)) {
                            return context.container.getAll<T>(identifier);
                        }
                    };
                });
        }


        return this;
    }

    public Bind<TType>(classType: new (...params: any[]) => TType): Startup {
        this._container.bind<TType>(classType).to(classType);
        return this;
    }

    public BindType<TInterface>(classType: new () => TInterface,
        symbol: symbol, singleton: boolean = false): Startup {
        var bind = this._container.bind<TInterface>(symbol)
            .to(classType)

        if (singleton) {
            bind.inSingletonScope();
        }

        return this;
    }

    public BindInstance<TInterface>(classType: TInterface, symbol: symbol): Startup {
        var bind = this._container.bind<TInterface>(symbol)
            .toConstantValue(classType);
        return this;
    }

    public BindDialog<TType>(classType: new () => TType, group: string, name: string): Startup {
        this._container.bind<TType>(group)
            .to(classType).whenTargetNamed(name);
        return this;
    }

    public BindNamed<TType>(classType: new (...param: any[]) => TType, group: string, name: string): Startup {
        this._container.bind<TType>(group)
            .to(classType).whenTargetNamed(name);
        return this;
    }

    public Resolve<T>(symbol: symbol, group?: string, name?: string) {
        if (group && name) {
            if (this._container.isBound(group)) {
                return this._container.getNamed<T>(group, name);
            }
        }

        return this._container.get<T>(symbol);
    }

    public ResolveByName<T>(group?: string, name?: string) {
        return this._container.getNamed(group, name);
    }

    private _registerDialogFactory() {
        this._container.bind<interfaces.Factory<contracts.IDialog>>("Factory<IDialog>")
            .toFactory<contracts.IDialog[]>((context: interfaces.Context) => {
                return () => {
                    if (context.container.isBound("IDialog")) {
                        return context.container.getAll<contracts.IDialog>("IDialog");
                    }
                };
            });

        this._container.bind<interfaces.Factory<contracts.IDialog>>("Factory<ITopic>")
            .toFactory<contracts.ITopic[]>((context: interfaces.Context) => {
                return () => {
                    if (context.container.isBound("ITopic")) {
                        return context.container.getAll<contracts.ITopic>("ITopic");
                    }
                };
            });
    }



    private _setupSystemServices() {
        this._container.bind<contracts.IConfig>(contracts.contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());

        this._container.bind<contracts.ILogService>(contracts.contractSymbols.ILogService)
            .to(logService).inSingletonScope();

        this._container.bind<contracts.INetClient>(contracts.contractSymbols.INetClient)
            .to(netClient).inSingletonScope();
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
    public get container(): Container {
        return this._container;
    }
}