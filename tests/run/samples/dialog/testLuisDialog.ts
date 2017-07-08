import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import { testBase } from './../../../testBase';

import luisDialog from "../../../../src/dialogs/samples/luisDIalog";
import * as contracts from "../../../../src/system/contract/contracts";


class testLuisDialog extends testBase {

    private _luisDialog: contracts.IDialog;

    constructor() {
        super();
        this._luisDialog = this.resolveDialog<contracts.IDialog>('luisDialog');

    }

    //the user has entered a query that results in the luisDialog needing
    //to prompt the user for more information. 

    testStep1_needsEntity(t: TestContext) {
        t.not(undefined, this._luisDialog);
        t.is(this._luisDialog.name, 'luisDialog');

        var func = this._luisDialog.waterfall[0];

        var args = {
            "action": "*:luisDialog", "intent": {
                "score": 0.3312974, "intent": "SubmitTicket", "intents": [{
                    "intent"
                    : "SubmitTicket", "score": 0.3312974
                }, { "intent": "HandOffToHuman", "score": 0.154576644 },
                { "intent": "ExploreKnowledgeBase", "score": 0.0538623519 },
                { "intent": "Help", "score": 0.03384778 }, { "intent": "None", "score": 0.0298019145 }], "entities": []
            }, "libraryName": "*"
        }

        var next = sinon.spy();
        var textSpy = sinon.spy(builder.Prompts, 'text');
        //var sessionStub = sinon.createStubInstance(MyConstructor) ;
        var session: builder.Session = sinon.createStubInstance(builder.Session);
        func(session, args, next);
        textSpy.restore();
        t.is(0, next.callCount)
        t.true(textSpy.calledWith(session, 'Please provide entityName'));
    }

    //the user has entered a query resulting in the dialog not needing to 
    //collect any more information and will call next method straight away wihtout
    //asking for a dialog prompt

    testStep1_hasEntity(t: TestContext) {

        t.not(undefined, this._luisDialog);
        t.is(this._luisDialog.name, 'luisDialog');

        var func = this._luisDialog.waterfall[0];

        var args = { "action": "*:luisDialog", "intent": { "score": 0.901591837, "intent": "SubmitTicket", "intents": [{ "intent": "SubmitTicket", "score": 0.901591837 }, { "intent": "HandOffToHuman", "score": 0.127539277 }, { "intent": "ExploreKnowledgeBase", "score": 0.0437066928 }, { "intent": "None", "score": 0.02504362 }, { "intent": "Help", "score": 0.01835419 }], "entities": [{ "entity": "networking", "type": "category", "startIndex": 24, "endIndex": 33, "resolution": { "values": ["networking"] } }] }, "libraryName": "*" }

        var next = sinon.spy();
        var textSpy = sinon.spy(builder.Prompts, 'text');
        //var sessionStub = sinon.createStubInstance(MyConstructor) ;
        var session: builder.Session = sinon.createStubInstance(builder.Session);

        func(session, args, next);
        textSpy.restore();

        t.true(next.calledOnce);
        t.is(textSpy.callCount, 0);

       
    }
}

var testClass = new testLuisDialog();

test(testClass.testStep1_hasEntity.bind(testClass));
test(testClass.testStep1_needsEntity.bind(testClass));

