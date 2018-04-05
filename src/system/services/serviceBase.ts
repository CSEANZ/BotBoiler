import { inject, injectable, Container } from "inversify";

import  * as systemContracts from "../contracts/systemContracts";

@injectable()
export class configBase{

    @inject(systemContracts.contractSymbols.IConfig)
    public config:systemContracts.IConfig;       
    
    public static Container:Container;

    public resolve<T>(symbol:symbol){
        return configBase.Container.get<T>(symbol);
    }
}

@injectable()
export class serviceBase extends configBase{    
    @inject(systemContracts.contractSymbols.ILogService)
    public logger: systemContracts.ILogService;
}