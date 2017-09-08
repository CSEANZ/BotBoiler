import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import {Provider, ConversationState} from './provider';

import {IRouter, IProvider} from './routerContracts';

@injectable()
export class Router implements IRouter{

    /** Provides the bot instance for this router */
    public SetBot(bot: builder.UniversalBot) {
        this._bot = bot;
    }

    private _bot : builder.UniversalBot;
    /** Returns the bot instance of this router */
    public Bot (): builder.UniversalBot {
        return this._bot;
    }

    private _provider = new Provider();
    /** Returns the provider for this router */
    public Provider(): IProvider {
        return this._provider;
    }

    /**Returns whether the session belongs to an agent */
    public IsAgent(session: builder.Session): boolean {
        return session.conversationData.isAgent;
    }

    /**Returns number of conversations in the queue */
    public Pending () : number {
        return this._provider.CurrentConversations().filter((conv) => conv.state === ConversationState.WaitingForAgent).length;
    };

     /** This method returns a function to be added to bot.on(...) */
    public Middleware (): builder.IMiddlewareMap {
        return {
            botbuilder: (session, next) => {
                if (session.message.type === 'message') {
                    console.log('router middleware');
                    if (this.IsAgent(session)) {
                        this.RouteAgentMessage(session);
                    } else {
                        this.RouteUserMessage(session, next);
                    }
                } else {
                    next();
                }
            }
        };
    };

    private RouteAgentMessage = (session) => {
        const message = session.message;
        const conversation = this._provider.FindByAgentConversationId(message.address.conversation.id);
    
        if (!conversation) {
            return;
        }
    
        this._bot.send(new builder.Message().address(conversation.user).text(message.text));
    };

    private RouteUserMessage = (session, next) => {
        const message = session.message;
    
        const conversation = this._provider.FindByUserConversationId(message.address.conversation.id) || this._provider.CreateConversation(message.address);
    
        switch (conversation.state) {
            case ConversationState.ConnectedToBot:
                return next();
            case ConversationState.WaitingForAgent:
                session.send(`Connecting you to the next available human agent... please wait, there are ${this.Pending()-1} users waiting.`);
                return;
            case ConversationState.ConnectedToAgent:
                this._bot.send(new builder.Message().address(conversation.agent).text(message.text));
                return;
        }
    };

}
