import { injectable, inject } from "inversify";
import * as routerContracts from './routerContracts';
import * as builder from 'botbuilder';

// Conversation state enumeration
export const ConversationState = {
    ConnectedToBot: 0,
    WaitingForAgent: 1,
    ConnectedToAgent: 2
};



@injectable()
export class Provider implements routerContracts.IProvider{

    constructor() {
        this._data = [];
    }
    private _data: routerContracts.IConversation[];

    /**returns an array of conversations in queue */
    public CurrentConversations(): routerContracts.IConversation[] {
        return this._data;
    };

    /** Creates a conversation and adds it to the list*/
    public CreateConversation(address: builder.IAddress): routerContracts.IConversation {
        const conversation = {
            timestamp: new Date().getTime(),
            user: address,
            state: ConversationState.ConnectedToBot,
            agent: null
        };

        this._data.push(conversation);

        return conversation;
    };

    /** find a conversation by its user conversation id */
    public FindByUserConversationId(id: string): routerContracts.IConversation {
        return this._data.find((conversation) => conversation.user.conversation.id === id);
    };

    /** find a conversation by its agent conversation id */
    public FindByAgentConversationId(id: string): routerContracts.IConversation {
        return this._data.find((conversation) => conversation.agent && conversation.agent.conversation.id === id);
    };

    /** find a conversation by its agent conversation id and connect to agent*/
    public PeekConversation(agent: builder.IAddress): routerContracts.IConversation {
        var conversation = this._data.sort((a, b) => a.timestamp - b.timestamp).find((conversation) => conversation.state === ConversationState.WaitingForAgent);
        if (conversation) {
            conversation.state = ConversationState.ConnectedToAgent;
            conversation.agent = agent;
        }
        return conversation;
    };
}
