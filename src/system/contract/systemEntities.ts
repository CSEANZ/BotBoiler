export interface IConfig{
    port: string,
    microsoftAppId?: string,
    microsoftAppPassword?: string,
    luisModelUrl?: string,
    serverType?: serverTypes, 
    qna_id?:string,
    qna_subs?:string,
    sentimentUrl? :string,
    sentimentkey? :string
}

export enum serverTypes {
    AzureFunctions,
    AWSLambda,
    Local
} 