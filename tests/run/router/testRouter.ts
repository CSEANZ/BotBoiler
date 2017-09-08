import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import { testBase } from './../../testBase';

import * as contracts from "../../../src/system/contract/contracts";
import * as routerContracts from '../../../src/system/router/routerContracts';
import { Provider, ConversationState } from '../../../src/system/router/provider';
import { Router } from '../../../src/system/router/router';

class testRouter extends testBase {

    private _router: routerContracts.IRouter;
    private _providerStub;
    private _botStub;
    constructor() {
        super();
        this._router =
            this.resolve<routerContracts.IRouter>(routerContracts.modelSymbols.IRouter);

    }

    private _resetStubs() {
        this._providerStub = sinon.createStubInstance(Provider);
        this._botStub = sinon.createStubInstance(builder.UniversalBot);
        this._router['_provider'] = this._providerStub;
        this._router['_bot'] = this._botStub;
    }

    testStep1_testMiddlewareMethod(t: TestContext) {

        t.not(undefined, this._router);

        var middlewareFunc = this._router.Middleware();

        t.not(undefined, middlewareFunc.botbuilder);

    }

    testStep2_testPending(t: TestContext) {

        this._resetStubs();
        t.not(undefined, this._router);

        this._providerStub.CurrentConversations.returns([
            { state: ConversationState.WaitingForAgent },
            { state: ConversationState.WaitingForAgent }]);



        t.true(this._router.Pending() == 2);

    }

    testStep3_testAgentRouting(t: TestContext) {
        this._resetStubs();
        var middleware = this._router.Middleware();
        var messageText = "hello";
        var m1: builder.ISessionMiddleware = middleware.botbuilder[0] || middleware.botbuilder;
        t.not(undefined, m1);
        var isAgentSpy = sinon.stub(this._router, 'IsAgent').returns(true);

        var session = sinon.createStubInstance(builder.Session);
        var next = sinon.spy();

        session.message = {
            text: messageText, type: 'message',
            address: {
                conversation: {
                    id: ''
                }
            }
        };

        this._providerStub.FindByAgentConversationId.returns({ user: {} });

        m1(session, next);

        t.true(isAgentSpy.called);
        t.true(this._providerStub.FindByAgentConversationId.called);
        t.true(this._botStub.send.called);
        // t.true(bot.send.calledWith())


        isAgentSpy.restore();
    }

    testStep4_testUserRouting(t: TestContext) {

        this._resetStubs();
        var middleware = this._router.Middleware();
        var messageText = "hello";
        var m1: builder.ISessionMiddleware = middleware.botbuilder[0] || middleware.botbuilder;
        t.not(undefined, m1);
        var isAgentStub = sinon.stub(this._router, 'IsAgent').returns(false);

        var session = sinon.createStubInstance(builder.Session);
        var next = sinon.spy();

        session.message = {
            text: messageText, type: 'message',
            address: {
                conversation: {
                    id: ''
                }
            }
        };
        var pendingStub = sinon.stub(this._router, 'Pending').returns(2);

        this._router.Pending
        // check connected to bot state
        this._providerStub.FindByUserConversationId.returns({ state: ConversationState.ConnectedToBot });
        m1(session, next);
        t.true(next.called);
        // check waiting for agent state
        this._providerStub.FindByUserConversationId.returns({ state: ConversationState.WaitingForAgent });
        m1(session, next);
        t.true(session.send.called);
        // check connected to agent state
        this._providerStub.FindByUserConversationId.returns({ state: ConversationState.ConnectedToAgent });
        m1(session, next);
        t.true(this._botStub.send.called);

        // check we only called them once
        t.true(next.calledOnce);
        t.true(session.send.calledOnce);
        t.true(this._botStub.send.calledOnce);

        t.true(isAgentStub.called);
        t.true(this._providerStub.FindByUserConversationId.calledThrice); // cos we called it 3 times


        isAgentStub.restore();
        pendingStub.restore();
    }



}

var testClass = new testRouter();

test(testClass.testStep1_testMiddlewareMethod.bind(testClass));
test(testClass.testStep2_testPending.bind(testClass));
test(testClass.testStep3_testAgentRouting.bind(testClass));
test(testClass.testStep4_testUserRouting.bind(testClass));


