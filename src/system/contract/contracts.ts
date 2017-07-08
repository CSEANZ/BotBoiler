import * as builder from 'botbuilder';

interface ILogService{
    log(logMessage: string);
    setLogCallback(callback:(logMessage:string) => any);
}

interface INetClient{
    postJson<TUpload, TResult>(url:string, path:string, postData:TUpload, headers?:any):Promise<TResult>;
}

interface IHostService{
    init(connector:any);
    export:any;
    log(message:string);
}

interface IBotService{
    boot();
}

//this is adapted from generator-botbuilder here: https://github.com/MicrosoftDX/generator-botbuilder/blob/master/generators/app/templates/dialogs-ts/idialog.ts

interface IDialog {
    id: string;
    name: string;
    trigger: string | RegExp;
    waterfall: builder.IDialogWaterfallStep[];
}

let contractSymbols = {
    ILogService: Symbol("ILogService"),    
    IConfig: Symbol("IConfig"),
    IHostService: Symbol("IHostService"),
    IBotService: Symbol("IBotService"), 
    INetClient: Symbol("INetClient")
}

export {contractSymbols, ILogService, IHostService, IBotService, IDialog, INetClient};