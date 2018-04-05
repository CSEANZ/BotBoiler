
import { ILogService } from "../contracts/systemContracts";
import { injectable, inject } from "inversify";


@injectable()
class logService implements ILogService {
    
    private _logCallback:(logMessage:string) => any;
    
    constructor() {
        this._logCallback = (logMessage)=>{
            console.log(logMessage);
        }        
    }

    public setLogCallback(callback:(logMessage:string) => any){
        this._logCallback = callback;    
    }

    public log(logMessage:string){
        this._logCallback(logMessage);
    }
}

export {logService};