import { TurnContext, BotStateSet } from "botbuilder";

import {
    DialogContext, Prompt, SkipStepFunction, WaterfallStep, Dialog, PromptValidator
} from 'botbuilder-dialogs';

let contractSymbols = {
    ILogService: Symbol("ILogService"),
    IConfig: Symbol("IConfig"),
    IBotService: Symbol("IBotService"),
    IHostService: Symbol("IHostService"),
    Storage: Symbol("Storage"),
    IStateService: Symbol("IStateService"), 
    Startup: Symbol("Startup"),
    INetClient: Symbol("INetClient")
}

export interface DialogContext extends DialogContext<TurnContext> {

}

export interface IDialogWaterfallStep extends WaterfallStep<TurnContext>{
    
}

export interface IPromptValidator<R, O = R> extends PromptValidator<R, O>{

}

export interface IBotDialog extends Dialog<TurnContext>{

}

export interface INetClient{
    postJson<TUpload, TResult>(url:string, path:string, postData:TUpload, headers?:any):Promise<TResult>;
    getJson<TResult>(url:string, path:string, headers?:any):Promise<TResult>;
}

export interface IIntent{
    trigger?: string|RegExp
}

export interface IDialog extends IIntent {
    id: string;    
    waterfall?: IDialogWaterfallStep[];
    dialog?: IBotDialog
    init?: () => void;
}

export interface ITopic {    
    id: string;
    trigger?: string | RegExp;
    begin(context?: TurnContext): Promise<any>,
    routeReply(context?: TurnContext): Promise<any>
}

export interface IStateService<TUserState, TConversationState> {
    getUserState(context: TurnContext): TUserState,
    getConversationState(context: TurnContext): TConversationState,
    getBotStateSet(): BotStateSet
}

export interface IConfig {
    port: string,
    microsoftAppId?: string,
    microsoftAppPassword?: string,
    luisModelUrl?: string,
    serverType?: serverTypes,
    qna_id?: string,
    qna_subs?: string
}

export interface IHostService<TUserState, TConversationState> {
    init(callbacks: { (context: TurnContext): void; }[]);
    log(message: string);
}

export interface IBotService {
    boot();
}

export enum serverTypes {
    AzureFunctions,
    AWSLambda,
    Local
}

export interface ILogService {
    log(logMessage: string);
    setLogCallback(callback: (logMessage: string) => any);
}



export { contractSymbols };