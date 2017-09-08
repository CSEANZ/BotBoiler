import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import { testBase } from './../../testBase';

import * as contracts from '../../../src/system/contract/contracts';

import * as routerContracts from '../../../src/system/router/routerContracts';
import {Provider, ConversationState} from '../../../src/system/router/provider';
import {Router} from '../../../src/system/router/router';


class routerTest_testCommand extends testBase {

    private _command: routerContracts.ICommand

    constructor() {
        super();
        this._command =
            this.resolve<routerContracts.ICommand>(routerContracts.modelSymbols.ICommand);

    }

    testStep1_testMiddlewareMethod(t: TestContext) {

        t.not(undefined, this._command);

        var middlewareFunc = this._command.Middleware();

        t.not(undefined, middlewareFunc.botbuilder);

        // need to mock router and replace command._router
        

    }

    testStep2_testQueueMe(t: TestContext) {

        var session = sinon.createStubInstance(builder.Session);
        session.message = {
            address: {
                conversation: {
                    id: 'testId'
                }
            }
        };
        
        var provider = sinon.createStubInstance(Provider);
        var callback = provider.FindByUserConversationId.returns(
            { state: ConversationState.ConnectedToBot});
        this._command['_provider'] = provider;

        var result = this._command.QueueMe(session);

        t.true(result);

        t.truthy(provider.FindByUserConversationId.called || provider.CreateConversation.called);

    }

    testStep3_testAgentCommand_agentHelp(t: TestContext) {
        var session = sinon.createStubInstance(builder.Session);
        var next = sinon.spy();
        session.message = {
            text: 'agent help',
            address: {
                conversation: {
                    id: 'testId'
                }
            }
        };

        this._command.AgentCommand(session, next);

        t.true(session.send.called);
    }

    testStep4_testAgentCommand_connect(t: TestContext){

        var session = sinon.createStubInstance(builder.Session);
        var next = sinon.spy();
        session.message = {
            text: 'connect',
            address: {
                conversation: {
                    id: 'testId'
                }
            }
        };

        var provider = sinon.createStubInstance(Provider);
        var callback = provider.PeekConversation.returns({});
        var router = sinon.createStubInstance(Router);
        var bot = sinon.createStubInstance(builder.UniversalBot);
        router.Bot.returns(bot);

        this._command['_router'] = router;
        this._command['_provider'] = provider;
        

        this._command.AgentCommand(session, next);

        t.true(provider.PeekConversation.called);
        t.true(session.send.called);
        t.true(bot.send.called);

    }

    testStep5_testAgentCommand_resume(t: TestContext) {
        var testId = 'testId';
        var session = sinon.createStubInstance(builder.Session);
        var next = sinon.spy();
        session.message = {
            text: 'resume',
            address: {
                conversation: {
                    id: testId
                }
            }
        };

        var provider = sinon.createStubInstance(Provider);
        provider.FindByAgentConversationId.returns({});
        var router = sinon.createStubInstance(Router);
        var bot = sinon.createStubInstance(builder.UniversalBot);
        router.Bot.returns(bot);

        this._command['_router'] = router;
        this._command['_provider'] = provider;
        

        this._command.AgentCommand(session, next);

        t.true(provider.FindByAgentConversationId.calledWith(testId));
        t.true(session.send.called);
        t.true(bot.send.called);
    }
}

var testClass = new routerTest_testCommand();

test(testClass.testStep1_testMiddlewareMethod.bind(testClass));
test(testClass.testStep2_testQueueMe.bind(testClass));
test(testClass.testStep3_testAgentCommand_agentHelp.bind(testClass));
test(testClass.testStep4_testAgentCommand_connect.bind(testClass));
test(testClass.testStep5_testAgentCommand_resume.bind(testClass));
