import { inject, injectable } from "inversify";

import * as contracts from "../contract/contracts";
import { IConfig } from "../contract/systemEntities";


@injectable()
export class serviceBase{

    @inject(contracts.contractSymbols.IConfig)
    public config:IConfig;
    
    @inject(contracts.contractSymbols.ILogService)
    public logger: contracts.ILogService;
}