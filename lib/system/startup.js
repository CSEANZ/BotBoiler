"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const contracts = require("./contracts/systemContracts");
const serviceBase_1 = require("./services/serviceBase");
const serverHelper_1 = require("./helpers/serverHelper");
const logService_1 = require("./services/logService");
const consoleHostService_1 = require("./services/hosting/consoleHostService");
const stateService_1 = require("./services/stateService");
class Startup {
    /**
     *
     */
    constructor() {
        this._container = new inversify_1.Container();
        this.BindInstance(this, contracts.contractSymbols.Startup);
        Startup.Container = this._container;
        serviceBase_1.configBase.Container = this._container;
        this._setupSystemServices();
        this._registerDialogFactory();
    }
    Boot() {
        this.Bot.boot();
        return this;
    }
    get Bot() {
        return this.Resolve(contracts.contractSymbols.IBotService);
    }
    /**
     *
     *
     * @template T
     * @returns {Startup}
     * @memberof Startup
     */
    ConfigureMiddleware() {
        return this;
    }
    UseBot(botType) {
        this._container.bind(contracts.contractSymbols.IBotService)
            .to(botType)
            .inSingletonScope();
        return this;
    }
    UseConsoleHost() {
        this._container.bind(contracts.contractSymbols.IHostService)
            .to(consoleHostService_1.consoleHostService);
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
    UseStateStore(storeType) {
        this._container.bind(contracts.contractSymbols.Storage)
            .to(storeType).inSingletonScope();
        return this;
    }
    UseState() {
        this._container.bind(contracts.contractSymbols.IStateService)
            .to(stateService_1.default)
            .inSingletonScope();
        return this;
    }
    UseDialogs(dialogs) {
        this.BindAll("IDialog", true, false, dialogs);
        return this;
    }
    UseTopics(topics) {
        this.BindAll("ITopic", true, false, topics);
        return this;
    }
    BindAll(identifier, singleton, addFactory = false, items) {
        for (var i in items) {
            var dialog = items[i];
            if (typeof dialog == "function") {
                var binder = this._container.bind(identifier).to(dialog);
                if (singleton) {
                    binder.inRequestScope();
                }
                binder.whenTargetNamed(i);
            }
        }
        if (addFactory) {
            this._container.bind(`Factory<${identifier}>`)
                .toFactory((context) => {
                return () => {
                    if (context.container.isBound(identifier)) {
                        return context.container.getAll(identifier);
                    }
                };
            });
        }
        return this;
    }
    Bind(classType) {
        this._container.bind(classType).to(classType);
        return this;
    }
    BindType(classType, symbol, singleton = false) {
        var bind = this._container.bind(symbol)
            .to(classType);
        if (singleton) {
            bind.inSingletonScope();
        }
        return this;
    }
    BindInstance(classType, symbol) {
        var bind = this._container.bind(symbol)
            .toConstantValue(classType);
        return this;
    }
    BindDialog(classType, group, name) {
        this._container.bind(group)
            .to(classType).whenTargetNamed(name);
        return this;
    }
    BindNamed(classType, group, name) {
        this._container.bind(group)
            .to(classType).whenTargetNamed(name);
        return this;
    }
    Resolve(symbol, group, name) {
        if (group && name) {
            if (this._container.isBound(group)) {
                return this._container.getNamed(group, name);
            }
        }
        return this._container.get(symbol);
    }
    ResolveByName(group, name) {
        return this._container.getNamed(group, name);
    }
    _registerDialogFactory() {
        this._container.bind("Factory<IDialog>")
            .toFactory((context) => {
            return () => {
                if (context.container.isBound("IDialog")) {
                    return context.container.getAll("IDialog");
                }
            };
        });
        this._container.bind("Factory<ITopic>")
            .toFactory((context) => {
            return () => {
                if (context.container.isBound("ITopic")) {
                    return context.container.getAll("ITopic");
                }
            };
        });
    }
    _setupSystemServices() {
        this._container.bind(contracts.contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());
        this._container.bind(contracts.contractSymbols.ILogService)
            .to(logService_1.logService).inSingletonScope();
    }
    _prepConfig() {
        var sh = new serverHelper_1.serverHelper();
        this._config = {
            port: process.env.port || process.env.PORT || "3978",
            microsoftAppId: process.env.MICROSOFT_APP_ID,
            microsoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
            luisModelUrl: process.env.LUIS_MODEL_URL,
            serverType: sh.getServerType(),
            qna_id: process.env.QNA_ID,
            qna_subs: process.env.QNA_SUBS_KEY
        };
        return this._config;
    }
    /**
     * Property to access the IOC container
     * @returns Container
     */
    get container() {
        return this._container;
    }
}
exports.default = Startup;
//# sourceMappingURL=startup.js.map