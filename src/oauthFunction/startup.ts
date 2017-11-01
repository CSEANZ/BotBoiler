import "reflect-metadata";
import { Container, interfaces } from "inversify";

import { IdentityService } from '../services/implementations/identityService';
import { StorageService } from '../services/implementations/storageService';
import * as serviceContracts from '../services/serviceContracts';

import * as contracts from "../system/contract/contracts";

import { configBase } from "../system/services/serviceBase";
import { logService } from "../system/services/logService";
import { tokenService } from "../system/services/tokenService";

import { IConfig, serverTypes } from "../system/contract/systemEntities";

import { netClient } from "../system/helpers/netClient";
import { serverHelper } from "../system/helpers/serverHelper";

/**
 * Main startup class. Composes the app components in to the inversify IOC container
 */
export default class startup {

    private _container: Container;

    public get container(): Container {
        return this._container;
    }

    private _config: IConfig;

    public get config(): IConfig {
        return this._config;
    }

    constructor() {
        this._container = new Container();
        configBase.Container = this._container;

        this._setupSystemServices();
    }

    private _setupSystemServices() {
        this._container.bind<IConfig>(contracts.contractSymbols.IConfig)
            .toConstantValue(this._prepConfig());

        this._container.bind<contracts.ILogService>(contracts.contractSymbols.ILogService)
            .to(logService).inSingletonScope();

        this._container.bind<contracts.INetClient>(contracts.contractSymbols.INetClient)
            .to(netClient).inSingletonScope();

        this._container.bind<contracts.ITokenService>(contracts.contractSymbols.ITokenService)
            .to(tokenService).inSingletonScope();

        this._container.bind<serviceContracts.IIdentityService>(serviceContracts.modelSymbols.IIdentityService)
            .to(IdentityService);

        this._container.bind<serviceContracts.IStorageService>(serviceContracts.modelSymbols.IStorageService)
            .to(StorageService);
    }

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
}