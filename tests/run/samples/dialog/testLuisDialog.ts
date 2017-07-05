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

    testStep1(t: TestContext) {
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
        var session:builder.Session = sinon.createStubInstance(builder.Session) ;

        func(session, args, next);
        textSpy.restore();
        

        t.true(textSpy.calledWith(session, 'Please provide entityName'));
    }
}

var testClass = new testLuisDialog();

test(testClass.testStep1.bind(testClass));

