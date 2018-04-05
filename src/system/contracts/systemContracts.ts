export interface IConfig{
    port: string,
    microsoftAppId?: string,
    microsoftAppPassword?: string,
    luisModelUrl?: string,
    serverType?: serverTypes, 
    qna_id?:string,
    qna_subs?:string
}

export interface IHostService{
    init(connector:any);
    export:any;
    log(message:string);
}

export interface IBotService{
    boot();
}

export enum serverTypes {
    AzureFunctions,
    AWSLambda,
    Local
} 

export interface ILogService{
    log(logMessage: string);
    setLogCallback(callback:(logMessage:string) => any);
}

let contractSymbols = {
    ILogService: Symbol("ILogService"),    
    IConfig: Symbol("IConfig"),
    IBotService: Symbol("IBotService"), 
    IHostService: Symbol("IHostService")
}

export {contractSymbols};