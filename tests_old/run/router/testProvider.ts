import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import { testBase } from './../../testBase';

import * as contracts from "../../../src/system/contract/contracts";
import * as routerContracts from '../../../src/system/router/routerContracts';
import { Provider, ConversationState } from '../../../src/system/router/provider';
import { Router } from '../../../src/system/router/router';

class testProvider extends testBase {

    private _provider: routerContracts.IProvider;

    constructor() {
        super();
        this._provider =
            this.resolve<routerContracts.IProvider>(routerContracts.modelSymbols.IProvider);

    }

    testStep1_testConversations(t: TestContext) {

        this._provider['_data'] = [];
        t.not(undefined, this._provider);
        // make a fake dialog
        var conversation = {};
        this._provider['_data'] = [conversation];

        var conversations = this._provider.CurrentConversations();

        t.truthy(conversations);
        t.true(conversations.length == 1);

    }

    testStep2_testAddConversation(t: TestContext) {

        this._provider['_data'] = [];

        t.not(undefined, this._provider);
        var address: builder.IAddress = {
            channelId: "channelId",
            user: { id: "userId", name: "Nemo", isGroup: false },
            bot: { id: "botId", name: "Dory", isGroup: false },
            conversation: { id: "" }
        }

        var conversation = this._provider.CreateConversation(address);

        t.truthy(conversation);
        t.true(conversation.user === address);
    }

    testStep3_testFindInConversation(t: TestContext) {

        this._provider['_data'] = [];

        var agentId = "ImAnAgent";
        var convoId = "ImAConvo";
        t.not(undefined, this._provider);
        var address: builder.IAddress = {
            channelId: "channelId",
            user: { id: "userId", name: "Nemo", isGroup: false },
            bot: { id: "botId", name: "Dory", isGroup: false },
            conversation: { id: convoId }
        }

        var conversation = this._provider.CreateConversation(address);

        t.truthy(conversation);
        t.true(conversation.user === address);

        t.true(this._provider.CurrentConversations().length == 1);

        var convoConversation = this._provider.FindByUserConversationId(convoId);

        t.truthy(convoConversation);
    }

    testStep4_testAgentPeekAndFind(t: TestContext) {
        this._provider['_data'] = [];

        var agentId = "ImAnAgent";
        var convoId = "ImAConvo";
        t.not(undefined, this._provider);
        var userAddress: builder.IAddress = {
            channelId: "channelId",
            user: { id: "userId", name: "Nemo", isGroup: false },
            bot: { id: "botId", name: "Dory", isGroup: false },
            conversation: { id: convoId }
        }

        var agentAddress: builder.IAddress = {
            channelId: "channelId",
            user: { id: agentId, name: "Fred", isGroup: false },
            bot: { id: "botId", name: "Dory", isGroup: false },
            conversation: { id: convoId }
        }

        var c1 = this._provider.CreateConversation(userAddress);
        c1.state = ConversationState.WaitingForAgent;
        var c2 = this._provider.PeekConversation(agentAddress);
        t.truthy(c2.state);
        t.true(c2.state == ConversationState.ConnectedToAgent);
        t.true(c2.agent == agentAddress);
        t.true(c1 === c2);

        var c3 = this._provider.FindByAgentConversationId(convoId);

        t.true(c1 === c3);
        t.true(c1.agent.user.id == agentId);
        t.true(c3.agent.conversation.id == convoId);

    }

}

var testClass = new testProvider();

test(testClass.testStep1_testConversations.bind(testClass));
test(testClass.testStep2_testAddConversation.bind(testClass));
test(testClass.testStep3_testFindInConversation.bind(testClass));
test(testClass.testStep4_testAgentPeekAndFind.bind(testClass));

