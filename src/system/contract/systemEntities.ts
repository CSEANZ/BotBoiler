export interface IConfig{
    port: string,
    microsoftAppId?: string,
    microsoftAppPassword?: string,
    luisModelUrl?: string,
    serverType?: serverTypes, 
    KBID?:string,
    subscription?:string
}

export enum serverTypes {
    AzureFunctions,
    Local
} 