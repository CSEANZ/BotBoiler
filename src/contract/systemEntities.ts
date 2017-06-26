export interface IConfig{
    port: string,
    microsoftAppId: string,
    microsoftAppPassword: string,
    luisModelUrl: string,
    serverType: serverTypes
}


export enum serverTypes {
    AzureFunctions,
    Local
} 