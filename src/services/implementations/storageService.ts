import * as  azureStorage from 'azure-storage';
import * as  envx from 'envx';
import { injectable, inject } from "inversify";
import * as serviceContracts from '../serviceContracts';
import * as contracts from "../../system/contract/contracts";
import { IConfig } from "../../system/contract/systemEntities";
import { serviceBase } from '../../system/services/serviceBase'
import * as systemContracts from '../../system/contract/contracts';

@injectable()
export class StorageService implements serviceContracts.IStorageService {
    private _blobService;
    private _config: IConfig;
    private _logService: systemContracts.ILogService;

    constructor(
        @inject(contracts.contractSymbols.IConfig) config: IConfig,
        @inject(systemContracts.contractSymbols.ILogService) logService: systemContracts.ILogService) {

        this._config = config;
        this._logService = logService;

        this._blobService = azureStorage.createBlobService();
    }

    async CreateBlockBlob(container: string, name: string, json: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._blobService.createBlockBlobFromText(container, name, json, function (error, result, response) {
                if (error) {
                    reject(error);

                    return;
                }

                resolve();
            });
        });
    }

    async CreateContainer(container: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._blobService.createContainerIfNotExists(container, function (error, result, response) {
                if (error) {
                    reject(error);

                    return;
                }

                resolve();
            });
        });
    }

    async GetBlockBlob(container: string, name: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this._blobService.getBlobToText(container, name, function (error, blobContent, blob) {
                if (error) {
                    reject(error);

                    return;
                }

                resolve(blobContent);
            });
        });
    }
}

export default { StorageService }