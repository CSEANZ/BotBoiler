import { inject, injectable, Container } from "inversify";
import * as contracts from "../contract/contracts";
import { IConfig } from "../contract/systemEntities";
import * as serviceContracts from '../../services/serviceContracts';

@injectable()
export class configBase {

    @inject(contracts.contractSymbols.IConfig)
    public config: IConfig;

    public static Container: Container;

    public resolve<T>(symbol: symbol) {
        return configBase.Container.get<T>(symbol);
    }
}

@injectable()
export class serviceBase extends configBase {
    @inject(contracts.contractSymbols.ILogService)
    public logger: contracts.ILogService;

    @inject(serviceContracts.modelSymbols.IStorageService)
    public storageService: serviceContracts.IStorageService;

    log(message: string) {
        this.logger.log(message);
    }

    async isSignedIn(container: string, channelId: string, conversationId: string, userId: string): Promise<boolean> {
        let name = `${channelId}_${conversationId}_${userId}`;

        var blobContent = await this.storageService.GetBlockBlob(container, name);

        return blobContent != null;
    };
}