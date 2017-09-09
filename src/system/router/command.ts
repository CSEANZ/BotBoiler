
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as routerContracts from './routerContracts';

import {Provider, ConversationState} from './provider';

@injectable()
export class Command implements routerContracts.ICommand {

    private _router: routerContracts.IRouter;
    private _provider: routerContracts.IProvider;
    constructor(@inject(routerContracts.modelSymbols.IRouter) router: routerContracts.IRouter) {
        this._router = router;
        this._provider = router.Provider();
    }

    private _isAgent(session: builder.Session){
        return this._router.IsAgent(session);
    }

    /** This method returns a function to be added to bot.on(...) */
    public Middleware () : builder.IMiddlewareMap  { return {
        botbuilder: (session, next) => {
            console.log('command middleware');
            if (session.message.type === 'message' && this._isAgent(session)) {
                console.log('command middleware found agent');
                this.AgentCommand(session, next);
            } else {
                console.log('command middleware calling next');
                next();
                }
            }
        };
    };

    /** Scans a message for possible commands from an agent */
    public AgentCommand (session: builder.Session, next) {
        const message = session.message;
        const conversation = this._provider.FindByAgentConversationId(message.address.conversation.id);

        if (/^agent help/i.test(message.text)) {
            this._sendAgentHelp(session);
            return ;
        }

        if (!conversation) {
            if (/^connect/i.test(message.text)) {
                // peek a conversation from the queue if any
                let targetConversation = this._provider.PeekConversation(message.address);
                if (targetConversation) {
                    targetConversation.state = ConversationState.ConnectedToAgent;
                    session.send('You are now connected to the next user that requested human help.\nType *resume* to connect the user back to the bot.');
                } else {
                    session.send('No users waiting in queue.');
                    return;
                }

                var hello = 'You are now talking to a human agent.';
                this._router.Bot().send(new builder.Message().address(targetConversation.user).text(hello));
                return;
            } else {
                this._sendAgentHelp(session);
                return ;
            }
        } else {
            if (/^resume/i.test(message.text)) {
                // disconnect the user from the agent
                let targetConversation = this._provider.FindByAgentConversationId(message.address.conversation.id);
                targetConversation.state = ConversationState.ConnectedToBot;
                delete targetConversation.agent;
                session.send(`Disconnected. There are ${this._router.Pending()} users waiting.`);

                var goodbye = 'You are now talking to the bot again.';
                this._router.Bot().send(new builder.Message().address(targetConversation.user).text(goodbye));
                return;
            }
        }

        next();
    };

    /**Adds a session to the wait queue */
    public QueueMe (session: builder.Session): boolean {
        const message = session.message;
        // lookup the conversation (create it if one doesn't already exist)
        const conversation = this._provider.FindByUserConversationId(message.address.conversation.id) || this._provider.CreateConversation(message.address);

        if (conversation.state == ConversationState.ConnectedToBot) {
            conversation.state = ConversationState.WaitingForAgent;
            return true;
        }

        return false;
    };

    private _sendAgentHelp (session: builder.Session)  {
        session.send('### Human Agent Help, please type:\n' +
                     ' - *connect* to connect to the user who has been waiting the longest.\n' +
                     ' - *agent help* at any time to see these options again.\n' +
                     ' - *resume* to return the user to the bot.');
    };
}
