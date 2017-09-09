import * as builder from 'botbuilder';

export interface IConversation {
    timestamp: number;
    user: builder.IAddress;
    state: number;
    agent: builder.IAddress;
}

export interface ICommand {
     Middleware () : builder.IMiddlewareMap;
     AgentCommand (session: builder.Session, next);
     QueueMe (session: builder.Session): boolean;
}

export interface IProvider {
    CurrentConversations(): IConversation[];
    CreateConversation(address: builder.IAddress): IConversation
    FindByUserConversationId(id: string): IConversation ;
    FindByAgentConversationId(id: string): IConversation;
    PeekConversation(agent: builder.IAddress): IConversation;
}

export interface IRouter {

    Middleware(): builder.IMiddlewareMap;
    Bot (): builder.UniversalBot
    IsAgent(session: builder.Session): boolean ;
    SetBot(bot: builder.UniversalBot);
    Pending() : number;
    Provider(): IProvider;
}

let modelSymbols = {
    IRouter: Symbol('IRouter'),
    ICommand: Symbol('ICommand'),
    IProvider: Symbol('IProvider')
}

export {modelSymbols}