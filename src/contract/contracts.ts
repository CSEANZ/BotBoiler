import * as builder from 'botbuilder';

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

interface IDialog {
    id: String;
    name: String;
    waterfall: builder.IDialogWaterfallStep[];
}

let contractSymbols = {
    ILogService: Symbol("ILogService"),    
    IConfig: Symbol("IConfig"),
    IHostService: Symbol("IHostService"),
    IBotService: Symbol("IBotService")
}

export {contractSymbols, ILogService, IHostService, IBotService, IDialog};