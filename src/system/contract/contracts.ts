import * as builder from 'botbuilder';

interface ILogService{
    log(logMessage: string);
    setLogCallback(callback:(logMessage:string) => any);
}

interface INetClient {
    getJson(url: string, headers?: any): Promise<any>;
    postJson<TUpload, TResult>(url: string, path: string, postData: TUpload, headers?: any): Promise<TResult>;
}

interface IHostService{
    init(connector:any);
    export:any;
    log(message:string);
}

interface IBotService{
    boot();
}

interface ITokenService {
    init(bearer: string, channelId: string, conversationId: string, idToken: string, userId: string);
    process(): Promise<any>;
}

//this is adapted from generator-botbuilder here: https://github.com/MicrosoftDX/generator-botbuilder/blob/master/generators/app/templates/dialogs-ts/idialog.ts

interface IDialog {
    id: string;
    name: string;
    trigger: string | RegExp;
    waterfall: builder.IDialogWaterfallStep[];
    init?:(dialog:graphDialog) => boolean;
}

interface graphDialog{
    data?:dialogData;
    isLuis:boolean;
    triggerText?:string;
    triggerRegex?:RegExp;
    id:string; 
    initialSay?:string;   
    subsequentSay?:string;
    action?:dialogAction;
}

interface dialogAction{    
    serviceUrlAfter?:string;
    nextDialog?:string;
    serviceUrlText?:string;
    textUrlPrompt?:string;
}

interface dialogData{
    fields?:Array<dialogField>;
}

interface dialogField{
    //text that will ask if the field is missing
    promptText:string;
    entityName?:string;
    choice?:string[];
}

interface serviceResult{
    text?:string;
}

let contractSymbols = {
    ILogService: Symbol("ILogService"),    
    IConfig: Symbol("IConfig"),
    IHostService: Symbol("IHostService"),
    IBotService: Symbol("IBotService"), 
    INetClient: Symbol("INetClient"),
    dataDialog: Symbol("dataDialog"),
    ITokenService: Symbol("ITokenService"),
}

export {contractSymbols, ILogService, IHostService, IBotService, IDialog, INetClient,
    graphDialog, dialogData, dialogField, serviceResult, ITokenService};