# Overview

There are four main things you need to do when using IOC in this project. They are: a Contract, an Implementation, a Symbol, and a Binding.
We're using [inversify](http://inversify.io/).

Any class that will be injected needs to be decorated with `@injectable()`

In this project we're using constructor injection. To inject something into your constructor, use the `@inject(...)` decorator

## Contracts
Contracts are [interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) that define publicly exposed members of an object that implements the interface.

## Implementations
An implementation is a concrete [class](https://www.typescriptlang.org/docs/handbook/classes.html) or object that achieves a tasks. There may be many different ways of implementing an interface. For example, [BotBoiler](https://github.com/MSFTAuDX/BotBoiler) has two implementations of **IHostService** : **localHostService** for development and **azureFunctionsHostService** for hosting on Azure using Functions. At runtime, we determine whether we are running locally or on Azure, and inject the correct implementation. The rest of the code-base doesn't care how **IHostService** is implemented, as long as the contract as met.

## Symbols
A [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) is a comparator, designed to be a unique and comparable datatype. We use them to determine where required implementations are needed. We need them because, unlike most languages with interfaces, Typescript interfaces are not available at runtime because of javascript transpilation.

## Bindings
A [binding](https://github.com/inversify/InversifyJS/blob/master/wiki/symbols_as_id.md) tells our IOC framework which implementation is going to fulfil a contract/ interface.

#Example Walkthrough

## Creating the Sentiment Service

In this walkthrough, we're going to create the stub for our sentiment service. This service implements one method that takes a string as a parameter (the text we wish to analyse) and returns a number representing the score of the sentiment of that text.

### Contract
In **\src\services\serviceContracts.ts** we add the following interface, which defines the sentiment service we're going to create.


```
export interface ISentimentService {
    GetSentiment (text : string) : number ;
}
```


### Implementation
Next, we create a new file for writing the code that's going to implement our service. For now, we're going to fake it and just return 0.5 (indicating neither positive or negative sentiment) for any string we're given.

We create the file: **src\services\implementations\sentimentService.ts**

Then we add the following code to the file:

import { injectable, inject } from "inversify";
import * as serviceContracts from '../serviceContracts';


```
@injectable()
export class SentimentService implements serviceContracts.ISentimentService{

    public GetSentiment (text : string) : number {
        return 0.5;
    }
}
export default {SentimentService}
```



Notice how we've decorated the class with `@injectable()`. This hints to inversify what we're planning on doing with this class.

### Symbol
In **src\services\serviceContracts.ts** we create and export a symbol that can we used to resolve the service we've created.


```
let modelSymbols = {
    ISentimentService: Symbol("ISentimentService")
}
export {modelSymbols}
```


### Bindings

We're going to register our service in **src\startup.ts**

We need to import our service and contract:

```
import * as serviceContracts from './services/serviceContracts'
import {SentimentService} from './services/implementations/sentimentService';
```

Then we write a method to register the implementation with the interface and the symbol 
```
private _registerServices() {
        this._container.bind<serviceContracts.ISentimentService>(serviceContracts.modelSymbols.ISentimentService)
            .to(SentimentService);
    }
```

And call the method in the constructor of the startup class
`this._registerServices();`

## Consuming the Sentiment Service
Let's use our service in the sample Luis Dialog in **src\dialogs\samples\luisDialog.ts**

First, we reference our interface and inversify

```
import { injectable, inject } from "inversify";
import * as serviceContracts from '../../services/serviceContracts';
```

Then, we simply decorate our constructor correctly and our service will be injected


```
private _sentimentService: serviceContracts.ISentimentService; 

constructor (@inject(serviceContracts.modelSymbols.ISentimentService) sentimentService: serviceContracts.ISentimentService) {
    super();

    this._sentimentService = sentimentService;
}
```

Awesome! Now we can use our sentiment service as we like :)

```
 step1(session: builder.Session, args:any, next:Function)  {
    var s = this._sentimentService.GetSentiment("a"); // this is a test
    session.send("sentiment returned: " + s);
...
```


Nice work! Now you can create your own services.

