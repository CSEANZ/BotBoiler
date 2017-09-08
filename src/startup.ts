
import "reflect-metadata";
import { Container, interfaces } from "inversify"
import * as contracts from "./system/contract/contracts";

import { logService } from "./system/services/logService";
import { serverHelper } from "./system/helpers/serverHelper";

import { localHostService } from "./system/services/host/localHostService";
import { azureFunctionsHostService } from './system/services/host/azureFunctionsHost';

import { IConfig, serverTypes } from "./system/contract/systemEntities";
import { botService } from "./system/services/botService";

import * as dialogs from "./dialogs/dialogIndex";
import dataDialog from "./dialogs/dynamic/dataDialog";

import { netClient } from "./system/helpers/netClient";

import * as routerContracts from './system/router/routerContracts';

import {Command} from './system/router/command';
import {Provider} from './system/router/provider';
import {Router} from './system/router/router';

import * as modelContracts from './model/modelContracts';
import qnaComponent from './model/components/samples/qnaComponent';
import { configBase } from "./system/services/serviceBase";



/**
 * Main startup class. Composes the app components in to the inversify IOC container
 */
export default class startup {

    public _container: Container;
    private _config: IConfig;

    private _botService: contracts.IBotService;

    constructor() {
        this._container = new Container();
        configBase.Container = this._container;
        this._setupSystemServices();
        this._setupHostService();      
        this._registerDialogFactory();        
        this._registerCustomComponents();
        this._registerDialogs();  
        this._registerRouter();
    }
    
    /**
     * Add any custom components you write to the container here
     */
    private _registerCustomComponents(){
         //Your services registered here   
        this._container.bind<modelContracts.IQnaComponent>(modelContracts.modelSymbols.IQnaComponent)
                .to(qnaComponent);   
    }
    
    /**
     * Helper property to resolve the bot service. 
     * @returns contracts
     */
    public get botService(): contracts.IBotService {
        return this._container.get<contracts.IBotService>(contracts.contractSymbols.IBotService);
    }

    /**
     * Creates the dialog factory that can be used later to inject all registered dialogs in to a class
     * Example of this is on the botService class where dialogs() are injected. 
     */
    private _registerDialogFactory(){
        this._container.bind<interfaces.Factory<contracts.IDialog>>("Factory<IDialog>")
            .toFactory<contracts.IDialog[]>((context: interfaces.Context) => {
                return () => {
                    return context.container.getAll<contracts.IDialog>("dialog");                
                };
        });        
    }

    /**
     * Dynamically register any dialogs that are exposed from dialogIndex on the container
     */
    private _registerDialogs() {      

        for (var i in dialogs) {

            var dialog = dialogs[i];

            if (typeof dialog == "function") {
                this._container.bind<contracts.IDialog>("dialog")
                    .to(dialog).whenTargetNamed(i);
            }
        }      

        //the special data dialog. 
         this._container.bind<contracts.IDialog>(contracts.contractSymbols.dataDialog)
             .to(dataDialog);
        
    }

    private _registerRouter() {
        this._container.bind<routerContracts.ICommand>(routerContracts.modelSymbols.ICommand).to(Command);
        this._container.bind<routerContracts.IRouter>(routerContracts.modelSymbols.IRouter).to(Router).inSingletonScope();
        this._container.bind<routerContracts.IProvider>(routerContracts.modelSymbols.IProvider).to(Provider).inSingletonScope();
    }

    //you can now pull the dialogs from the container like this...
    //or use the Factory<IDialog> to inject as demonstrated in the constructor of botService
    // var all = this.container.getAll<contracts.IDialog>("dialog");        
    // var d = this.container.getNamed<contracts.IDialog>("dialog", "someBasicDialog");
        
    /**
     * Detect the current host (local, AWS or Functions) and register the appropriate service on the container
     */
    private _setupHostService() {

        if (this._config.serverType == serverTypes.AzureFunctions) {
            this._container.bind<contracts.IHostService>(contracts.contractSymbols.IHostService)
                .to(azureFunctionsHostService).inSingletonScope();
        }
        else if(this._config.serverType == serverTypes.AWSLambda){
            throw ("AWS NOT DONE YET :)");   
        } else {
            this._container.bind<contracts.IHostService>(contracts.contractSymbols.IHostService)
                .to(localHostService).inSingletonScope();
        }
    }
    
    /**
     * Registers a bunch of services needed by the system on the container
     */
    private _setupSystemServices() {
        this._container.bind<IConfig>(contracts.contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());

        this._container.bind<contracts.ILogService>(contracts.contractSymbols.ILogService)
            .to(logService).inSingletonScope();

        this._container.bind<contracts.IBotService>(contracts.contractSymbols.IBotService)
            .to(botService).inSingletonScope();

        this._container.bind<contracts.INetClient>(contracts.contractSymbols.INetClient)
            .to(netClient).inSingletonScope();        
    }
    /**
     * Imports the config from environment vars to the strongly typed IConfig object
     * @returns IConfig
     */
    private _prepConfig(): IConfig {

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

    /**
     * Property to access the IConfig object
     * @returns IConfig
     */
    public get config():IConfig{
        return this._config;
    }
}