A core tenet of this project is that all code must be testable. 

## Prerequisites

Before you begin this section you should read up on:

- [the Ava Javascript Unit Testing Framework](https://github.com/avajs/ava)
- Learn about stubs and spies using [Sinon](http://sinonjs.org/)
- Dependency Injection with [Inversify](http://inversify.io/)

You should also review the section on the best ways to run the tests inside VS Code from the [main readme document](https://github.com/MSFTAuDX/BotBoiler#normal-test). 

## What's this?

The idea here is that it is possible to create AVA tests that can load a component from the IOC Container ([Inversify](http://inversify.io/)) and run some tests against it. It can mock, stub, spy and replace methods to achieve the testing it requires. 

Given the system is composable and injectable it can swap out implementations for more favourable ones under testing conditions - the consuming class (i.e. a Dialog) will never know. 

In this simple example it doesn't swap out registered components it uses [Sinon](http://sinonjs.org/) to stub some of the core bot framework methods and call our dialogs from the testing classes. 

### Mocking the bot builder

The bot builder base framework is a large complex framework that would be hard to instantiate properly during a unit test. Using Sinon it can stub out methods of the framework as it needs so as to impersonate a working framework to the dialogs under test. 

Sinon also allows us to create spies, methods that record all their interactions on them - these are handy to detect what was call and what wasn't

In the example, we want to test two scenarios - one the dialog has detected that the user has not entered enough information and needs to prompt the user with a text dialog to fill in the gaps, and the other where the user has already passed in all the required information meaning the dialog can simply call ```next()``` and hand off to the next step in the waterfall. 

The dialog under test is [luisDialog.ts](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/dialogs/samples/luisDialog.ts) and the sample test is [testLuisDialog.ts](https://github.com/MSFTAuDX/BotBoiler/blob/master/tests/run/samples/dialog/testLuisDialog.ts).

### Setting up a test

Start by including the bits needed from the NPM packages and the services and contracts from the project:

```typescript
import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import { testBase } from './../../../testBase';

import luisDialog from "../../../../src/dialogs/samples/luisDIalog";
import * as contracts from "../../../../src/system/contract/contracts";
```

You'll note it's taken a dependency on ```ava```, ```botbuilder``` and ```sinon```. These are the core components of our testing strategy. 

Next create a class that will host each unit test:

```typescript
class testLuisDialog extends testBase {
    private _luisDialog: contracts.IDialog;
    constructor() {
        super();
        this._luisDialog = this.resolveDialog<contracts.IDialog>('luisDialog');
    }
```

Note this class depends on ```testBase```. This base class runs the ```startup``` class and composes the IOC container. It also has a couple of helper classes to help resolve things, such as our ```luisDialog```. 

Next add a test method:

```typescript
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
    t.true(textSpy.calledWith(session, 'Please provide entityName'));
}
```
Then instantiate and run the test using ```ava```. 
```typescript
var testClass = new testLuisDialog();
test(testClass.testStep1_needsEntity.bind(testClass));
```

There is a bit going on here, let's run through it. 

At the start of the test it runs a couple of assertions to make sure the dialog was resolved and it received a dialog with the correct name. This is just a bit of a sanity check. 

```typescript
testStep1_needsEntity(t: TestContext) {
    t.not(undefined, this._luisDialog);
    t.is(this._luisDialog.name, 'luisDialog');
```

Next get a reference to the function we want to test from the ```luisDialog``` that was retrieved in the constructor. 

```typescript
var func = this._luisDialog.waterfall[0];
```
**Note:** It must access the function via the ```waterfall``` accessor as we've resolved the ```IDialog``` interface and not the concrete ```luisDialog``` class. 

The next part is the arguments that the test will pass in to the dialog method. This was gained by running the dialog against the emulator and then writing out the args that were passed in using ```JSON.stringify()```. You can see a commented out example of this in [luisDialog.ts](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/dialogs/samples/luisDialog.ts)

```typescript
step1(session: builder.Session, args:any, next:Function)  {
    var sArgs = JSON.stringify(args);
    this.logger.log(sArgs);
```

Now the fun stuff. The test needs to check that the ```luisDialog``` takes the right path based on the data that is fed in. This particular test is checking that the dialog asks the user for more data. Examine this code from ```luisDialog```

```typescript
 const entity = builder.EntityRecognizer.findEntity(args.intent.entities, 'category');
if(entity) next({ response: entity.entity });
else builder.Prompts.text(session, 'Please provide entityName');
```

Note that if the ```entity``` is found, then the dialog will call ```next``` and pass in the entity, otherwise it will call ```builder.Prompts.text``` to get the required information. 

To check that this happens it needs to spy on these methods. 

```typescript
var next = sinon.spy();
var textSpy = sinon.spy(builder.Prompts, 'text');
```

```next``` is easy to spy on as it is passed in to the dialog when it is called. Here it creates a basic spy called next which will be passed in and it can check that ```next``` was *never* called - which is correct for this test scenario. 

More difficult however is checking if ```builder.Prompts.text``` was called. This is part of the ```botbuilder``` framework and is not injected via a function parameter. 

To this end, it creates a [Sinon stub](http://sinonjs.org/releases/v2.3.6/stubs/) of the method. This is good for a couple of reasons - first, it can tell if the method was called which in this scenario it needs to be. Second, calling the real ```builder.Prompts.text``` function would probably crash, as the framework is not properly initialised - this is running in a fake testing envionment. A stub allows the function to be called, and the spy to record the interaction, but nothing actually happens. 

Because this method has been replaced - it needs to be restored after the test is complete by calling ```textSpy.restore();```. 

The next part is stubbing the entire bot session. ```builder.Session``` is hard to instantiate without the proper bot environment running. It would require mocked out configs and a whole chain of dependencies to get going. Luckly the system can simply stub entire classes.

```typescript
var session: builder.Session = sinon.createStubInstance(builder.Session);
```

This will create a subbed ```builder.Session``` object that can be passed in to the dialog. The methods won't do anything when called, but they won't crash and will appear to be normal to the dialog. If you need to actually use a function from ```builder.Session``` check out how to implement fake functions using [Sinon Stubs](http://sinonjs.org/releases/v2.3.6/stubs/). 

Now comes the time to run the actual test on the function. 

```typescript
func(session, args, next);
textSpy.restore();
t.true(textSpy.calledWith(session, 'Please provide entityName'));
t.is(next.callCount, 0);
```

This code runs the function and passes in the stubs and spies. Once it's run it checks to see if the spys and stubs were run (or not!). Any deviation here will result in an incorrect test and it will fail. 

 For an example of the inverted "has enough data to call ```next()``` test" see the full listing of ```testStep1_hasEntity``` [here](https://github.com/MSFTAuDX/BotBoiler/blob/master/tests/run/samples/dialog/testLuisDialog.ts).