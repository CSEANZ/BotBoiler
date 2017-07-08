import { inject, injectable } from "inversify";

import * as contracts from "../contract/contracts";
import { IConfig } from "../contract/systemEntities";

@injectable()
export class configBase{

    @inject(contracts.contractSymbols.IConfig)
    public config:IConfig;       
}

@injectable()
export class serviceBase extends configBase{

    
    @inject(contracts.contractSymbols.ILogService)
    public logger: contracts.ILogService;
}