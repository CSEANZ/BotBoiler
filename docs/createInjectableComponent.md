
### Create an Injectable Component

A core tenet to this system is separation of concerns. To this end we're careful to always make sure a class does a single thing. A dialog is a dialog, it doesn't do other things like communicate to servers. 

### QnA Maker Component

In this example we'll add a component that can talk to the [Microsoft QnA Maker](https://docs.microsoft.com/en-au/azure/cognitive-services/qnamaker/home) Cognitive Service. QnA Maker is an AI service that makes it really simple to add basic Question and Answer functionality to your systems - including bots. 

You'll need to set one of these up before you can follow along here. If you don't want to set up QnA Maker now it's not a problem - this is just going to make a restful call to a web service, you can substitute the QnA Maker with any service. 

You'll need two values from your QnA Service - both are found on the settings page.  The knowledgebase id is found in the POST url example field: ```POST /knowledgebases/<knowledgebaseid>/generateAnswer```. Place this in the .env file ```QNA_ID``` field. 

The other value is the subscription key. This is foung in the same example area ```Ocp-Apim-Subscription-Key: <yourkey>```. Place this in the .env file ```QNA_SUBS_KEY``` field. 

Once your new QnA Maker is registered place the ```QNA_SUBS_KEY``` field in the ```.env``` file. 

### Create the component

It's suggested that you place your own components and services under src/model/components. 

Create a new file called ```qnaComponent.ts``` under src/model/components. The base template is similar to the dialog created earlier: 

```typescript
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts  from '../../system/contract/contracts';

@injectable()
export default class qnaComponent extends serviceBase {
   
}
```

Next you'll need an interface that can be registered with the dependency injection container. This is done in ```model/modelContracts.ts```.

Add the following interfaces:

 ```typescript
export interface IQnAAnswer {
    answer: string;
    score: number;
}

export interface IQnaComponent{
    getAnswer(question:string):Promise<IQnAAnswer>;
}

```

You'll also need to add a ```Symbol``` here to assist with depdency resolution at runtime. Unfortunately in Typescript, interfaces are not available at runtime, so we cannot use them to resolve depdencies at runtime, we must use a ```Symbol``` instead. 

Local ```let modelSymbols = {``` section and add a new Symbol for our new component:

```typescript
let modelSymbols = {
    IQnaComponent: Symbol("IQnaComponent")
}
```
In a typical project you'll end up with lots of these Symbols. See [this file](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/system/contract/contracts.ts) for an example of how that would look. 

Now add the interface to your new component back in ```qnaComponent.ts```

First, include ```modelContracts``` by adding the following to the top of the file:

```typescript
import * as modelContracts from '../modelContracts';
```

Now implement from the interface:

```typescript
@injectable()
export default class qnaComponent extends serviceBase implements modelContracts.IQnaComponent {   
}
```

You may notice that VS Code as placed a little red underline under the class name ```qnaComponent```. You can click on this word, press ```ctrl-.``` and it will allow you to implement the interface. If you can't do that for some reason just paste in the following inside the class squigglies. 

```typescript
getAnswer(question: string): Promise<modelContracts.IQnAAnswer> {
    throw new Error("Method not implemented.");
}
```

Now we need to do the heavy lifting - actually call to get the QnA stuff. 

The core code of the framework includes a helper called [netClient](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/system/helpers/netClient.ts) which can be injected in to any class at runtime. Let's inject that now. 

Create a new private field to host the ```netClient``` instance:

```typescript
private _netClient:contracts.INetClient
```

Next, request the ```netClient``` be injected:

```typescript
constructor(@inject(contracts.contractSymbols.INetClient) netClient:contracts.INetClient) {
    super();
    this._netClient = netClient;
}
```
**Note:** If the injection syntax seems a little strange to you (say for instance you're accustomed to Autofac) then you can brush up on [Inversify here](http://inversify.io/). 

#### Do some work - grab the QnA answer

First, add the ```async``` keyword on to the front of the ```getAnswer``` class:

```typescript
async getAnswer(question: string): Promise<modelContracts.IQnAAnswer> {
```

Find the line ```throw new Error("Method not implemented.");``` and replace it so your method looks like this:

```typescript
async getAnswer(question: string): Promise<modelContracts.IQnAAnswer> {        
    const bodyText = { question: question };
    const url = `https://westus.api.cognitive.microsoft.com`;
    const path = `/qnamaker/v1.0/knowledgebases/${this.config.qna_id}/generateAnswer`;
    
    this.logger.log(`Url: ${url}/${path} Question: ${question}`);


    try{
        var result = await this._netClient.postJson<any, modelContracts.IQnAAnswer>(url, path, bodyText,  
            {'Ocp-Apim-Subscription-Key':this.config.qna_subs}); 
        return result;
    }catch(e){
        return e;
    }
}
```
You can see the ```netClient``` being used to get the QnA result. You may also note it's using config from the base class ```serviceBase```. This is handy so you don't have to inject ```IConfig``` every time you want to use it somewhere. 

#### Register the new component for injection

In the above example, we were able to request that INetClient be injected in to the class because it has been registered on the IOC container for Dependency Injection. Now we need to do this for the new component. 

Open up ```startup.ts```. This is where all the DI binding happens. It's a magical place. 

Include a reference to your new component up the top. 

```typescript
//modelContracts is probably already there, add your new component after this line
import * as modelContracts from './model/modelContracts';
import qnaComponent from './model/components/qnaComponent';
```

Now locate the line in ```startup.ts``` that says "//Your services registered here". It's in ```_registerCustomComponents()```.

Add a new registration for your service:

```typescript
this.container.bind<modelContracts.IQnaComponent>(modelContracts.modelSymbols.IQnaComponent)
    .to(qnaComponent);
```

You can now request this to be injected in to a class such as a dialog!

#### Consume the new component

We'll consume the component from the sample dialog created before. Open ```someDialog.ts``` and paste in just under the other public fields:

```typescript
private _qnaMaker: modelContracts.IQnaComponent; 

constructor(@inject(modelContracts.modelSymbols.IQnaComponent)qnaMaker: modelContracts.IQnaComponent) {
    super();
    
    this._qnaMaker = qnaMaker;
}
```

You like like to change the trigger regex to something better like ```public trigger:RegExp = /^ask$/i```. 

Next change ```step1``` so it asks a question like "What would you like to know?"

```typescript
 step1(session: builder.Session, args:any, next:Function)  { 
    session.send(`Hi there! I'm boiler bot`);
    builder.Prompts.text(session, `What would you like to know?`);       
}
```

Next, make ```step2``` ```async``` and change the code to:

```typescript
 async step2(session: builder.Session, results:builder.IDialogResult<string>, next:Function) {  
    var question = results.response;
    try{
        var result = await this._qnaMaker.getAnswer(question);
        if (result.score > 50) {
            session.endConversation(result.answer);
        } else if (result.score > 0) {
            session.send(`I'm not sure if this is right, but here's what I know...`);
            session.endConversation(result.answer);
        } else {
            session.endConversation(`I don't have that answer.`);
        }
    }catch(e)
    {
        session.endConversation(`Alas, I am broken.`);
        this.logger.log(e);
    }  
}
```

Now you can type "ask" to your bot, then type a question from your QnA!

<img width="640" src="https://user-images.githubusercontent.com/5225782/27895544-c2a66328-6256-11e7-93ea-d44acb5bf3ff.gif"/>

Full listings of these classes can be found here: [qnaDialog](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/dialogs/samples/qnaDialog.ts) and [qnaComponent](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/model/comonents/samples/qnaComponent.ts)


Next >> [Testable Dialogs](https://github.com/MSFTAuDX/BotBoiler/blob/master/docs/testableDialogs.md)