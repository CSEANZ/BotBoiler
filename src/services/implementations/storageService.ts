import * as  azureStorage from 'azure-storage';
import * as  envx from 'envx';
import { injectable, inject } from "inversify";
import * as serviceContracts from '../serviceContracts';
import { serviceBase } from '../../system/services/serviceBase'
import * as systemContracts from '../../system/contract/contracts';

const AZURE_STORAGE_ACCOUNT = envx("AZURE_STORAGE_ACCOUNT");
const AZURE_STORAGE_ACCESS_KEY = envx("AZURE_STORAGE_ACCESS_KEY");
const AZURE_STORAGE_CONNECTION_STRING = envx("AZURE_STORAGE_CONNECTION_STRING");

@injectable()
export class StorageService implements serviceContracts.IStorageService {
    private _blobService;
    private _logService: systemContracts.ILogService;

    constructor( @inject(systemContracts.contractSymbols.ILogService) logService: systemContracts.ILogService) {
        this._blobService = azureStorage.createBlobService();
        this._logService = logService;
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