import { TurnContext, BotStateSet } from "botbuilder";

let contractSymbols = {
    ILogService: Symbol("ILogService"),    
    IConfig: Symbol("IConfig"),
    IBotService: Symbol("IBotService"), 
    IHostService: Symbol("IHostService"), 
    Storage: Symbol("Storage"),
    IStateService:Symbol("IStateService")
}

export interface ITopic{
    begin(context: TurnContext): Promise<any>, 
    routeReply(context: TurnContext): Promise<any>
}

export interface IStateService<TUserState, TConversationState>{
    getUserState(context: TurnContext): TUserState,
    getConversationState(context: TurnContext): TConversationState, 
    getBotStateSet() : BotStateSet
}

export interface IConfig{
    port: string,
    microsoftAppId?: string,
    microsoftAppPassword?: string,
    luisModelUrl?: string,
    serverType?: serverTypes, 
    qna_id?:string,
    qna_subs?:string
}

export interface IHostService<TUserState, TConversationState>{
    init(callback:(context: TurnContext) => void);    
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



export {contractSymbols};