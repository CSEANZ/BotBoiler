interface ILogService{
    log(logMessage: string);
    setLogCallback(callback:(logMessage:string) => any);
}

interface IHostService{
    init(connector:any);
}

interface IBotService{
    boot();
}

let contractSymbols = {
    ILogService: Symbol("ILogService"),    
    IConfig: Symbol("IConfig"),
    IHostService: Symbol("IHostService"),
    IBotService: Symbol("IBotService")
}

export {contractSymbols, ILogService, IHostService, IBotService};