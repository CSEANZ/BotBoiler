import * as builder from 'botbuilder';

export interface IApplicationStateMonitoringService {

}

export interface IIdentityService {
    GetUser(bearer: string): Promise<string>;
    VerifyIdToken(bearer: string, url: string): Promise<boolean>;
}

export interface IMessageInterceptorService {
    AddInterceptor(key: string, callback: (session: builder.Session) => void)
    RemoveInterceptor(key: string);
    OnMessage(session: builder.Session);
}

export interface ISentimentService {
    GetSentiment(text: string): Promise<number>;
}

export interface IStorageService {
    CreateBlockBlob(container: string, name: string, json: string): Promise<void>;
    CreateContainer(container: string): Promise<void>;
    GetBlockBlob(container: string, name: string): Promise<string>;
}

export interface ITranslatorTextService {
    Detect(text: string): Promise<string>;
    Translate(text: string, to: string, from?: string): Promise<string>;
}

let modelSymbols = {
    IIdentityService: Symbol('IIdentityService'),
    ITranslatorTextService: Symbol('ITranslatorTextService'),
    IStorageService: Symbol('IStorageService')
}

export { modelSymbols }