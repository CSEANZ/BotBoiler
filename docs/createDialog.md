
## Create a dialog

Dialogs are the heart of most bots. Adding them is super simple in this framework. Dialogs are exposed via the ```dialogIndex``` module. Any dialog that is exposed here will be automatically added to the IOC Container ([Inversify](http://inversify.io/)) and added to the bot dialog. Any dialog exposed in this way can ask for any other component or service that has been registered to be injected at runtime. 

### Add the dialog

**Note** there are some [samples](https://github.com/MSFTAuDX/BotBoiler/tree/master/src/dialogs/samples) you can follow. 

Let's create a super simple two step dialog. 

Dialogs are javascript [classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) in this framework. They implement the [```IDialog```](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/system/contract/contracts.ts#L24) interface. You can see the [interface](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/system/contract/contracts.ts#L24) says we need to expose each step as an array via the ```waterfall()``` getter. 

At the end of the day Dialogs are still based on the [waterfall](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-manage-conversation-flow) approach - you may like to do further reading on that if you're not familiar with the concept before moving forward.  

First, create a new dialog under src/dialogs. Use this template to get started. It sets up the dialog for injection, extends the base class and implements the IDialog interface. In this example we'll not take any injected dependencies for simplicity (more on that further down). 

```typescript
import { serviceBase } from './../system/services/serviceBase';
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../system/contract/contracts';

@injectable()
export default class someDialog extends serviceBase implements contracts.IDialog{
    public id:string = 'someDialog';
    public name:string ='someDialog';
    public trigger:RegExp = /^somedialog$/i

    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1.bind(this), this.step2.bind(this)];
    }

    step1(session: builder.Session, args:any, next:Function)  {  

    }

    step2(session: builder.Session, results:builder.IDialogResult<string>, next:Function) { 

    }
}
```

#### Some notes
 This bot has a ```RegExp``` trigger - in this case it will be triggered if you use types "somedialog". You can write any regex here you like. If you're working with [LUIS dialogs](https://github.com/MSFTAuDX/BotBoiler/blob/master/src/dialogs/samples/luisDialog.ts), the trigger will be a regular ```string``` that matches the LUIS intent name. 

There are two steps, each one matches an available signature in the ```IDialogWaterfallStep``` interface from ```bot builder```. 

The steps are exposed via the ```get waterfall()``` accessor. The order they are listed here is the order they will "waterfall" during a conversation. 

#### Add a chat

Inside ```step1``` let's add some chat: 

```typescript
session.send(`Hi there! I'm boiler bot`);
builder.Prompts.text(session, `What's your name?`);    
```

Inside ```step2``` let's show what they entered:

```typescript
session.endConversation(`Welcome, ${results.response}`);
```

#### Add the dialog to the bot

Open up ```dialogIndex.ts``` and add: 

```typescript
import someDialog from './someDialog'
export {someDialog};
//it might look more like this now: export {someBasicDialog, luisDialog, qnaDialog, someDialog};
```

That's it! The system will now automatically add this dialog and you can now type "somedialog" in the emulator to kick things off (hopefully you're using the development flows listed above to automatically build and run!)

<img width="640" src="https://user-images.githubusercontent.com/5225782/27893138-2d78973a-6247-11e7-9a97-12d1a7965557.gif"/>

This is a super simple example. Let's get more complex. 

Next >> [Create an Injectable Component](https://github.com/MSFTAuDX/BotBoiler/blob/master/docs/createInjectableComponent.md)