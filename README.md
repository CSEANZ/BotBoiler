# BotBoiler
Boilerplate code for Typescript based bots.

BotBoiler is base code to get you started with an enterprise scale Node+Typescript based bot. 

It's tenets are that it must be composable, testable, extensible, adhere to separation of concerns and above all be simple, elegant and maintainable.

## Prerequisites

Before you begin, it's recommended that you're across the following:

- [Bot Builder and the Bot Framework](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-quickstart)
- Read up on using Typescript in Visual Studio Code: [Visual Studio code and Typescript](https://code.visualstudio.com/docs/languages/typescript)



## Getting Started

*Note* We are working on a [generator](https://github.com/MSFTAuDX/generator-botboiler) to help get started quickly which will be available soon. 

Clone [this](https://github.com/MSFTAuDX/BotBoiler) GitHub repo and launch VS Code from the base directory of the project. 

### Debugging your bot using the Bot Framework Emulator

Using the various methods below you can connect to your bot for local debugging. Using one of F5 Debugging in code or "Normal Dev Iteration" using ```tsc``` watch and ```nodemon``` you can connect to your bot using the [Bot Framework Emulator](https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator) on the default port of ```3978```.

For more info on the emulator [here](https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator) and downloads for Windows, Mac and Linux [here](https://github.com/Microsoft/BotFramework-Emulator/releases).

## Working with the framework

This project and documentation is based on [Visual Studio Code](https://code.visualstudio.com/) but you can of course use any tool that works well with Node and Typescript!

There are a few modes of development you might like to choose depending on your development phase. 

### Normal Dev Iteration

*Watch mode. You're working away and you want the code to recompile and the test bot server always be up to date.*

This mode is simple to start (instructions are for [Visual Studio Code](https://code.visualstudio.com/))

- Kick off a build using ```crtl-shift-b```. On the output screen you should see something like ```10:14:11 AM - Compilation complete. Watching for file changes.```
- Open a new terminal window (```ctrl-~``` is the default shortcut to bring this up.)
- Type ```npm run outputwatch``` to watch output file changes using nodemon. 
- Edit your files, connect to your bot and off you go!

By using ```tsc``` in watch mode your Typescript code will be transpiled to the output/run directory. This will then cause ```nodemon``` to restart your server with the latest changes every time you save. Nice!  You'll see outputs to this effect in your terminal window. 

<img src="https://user-images.githubusercontent.com/5225782/27891601-0cfaae16-623e-11e7-94c8-cf656789258e.gif" width="720" alt="nodemon"/>

**Note on working with many terminal windows in VS Code** When working with multiple terminals, it can become cumbersome to need to switch between them with the mouse all the time. Luckily you can add a keyboard short cuts. Press ```ctrl-shift-p```, type ```keyboard``` and select ```Preferences: Open Keyboard Shortcuts File```. Add the following shortcuts:

```json
// Place your key bindings in this file to overwrite the defaults
[
    {
        "key": "ctrl-alt-left",
        "command": "workbench.action.terminal.focusPrevious"
    },
    {
        "key": "ctrl-alt-right",
        "command": "workbench.action.terminal.focusNext"
    }
]
```

**Note** Pressing ```ctrl-shift-b``` in VS Code will kick off a build that will never stop - i.e. runs ```tsc``` in watch mode which will never exit until you break out. You'll know this is the case because of the "spinny thing" &trade; in the bottom left hand corner. To kill it, just run the build again - a message at the top of the screen will ask if you want to terminate it. 

![spinnything](https://user-images.githubusercontent.com/5225782/27891293-5c4e6554-623c-11e7-8834-9921633ddbb8.gif)

### Debug Dev

*Debug mode. You've been working away, and have a bug that you need to debug.* 

**Note** Make sure other build / monitor processes are not running by switching to the terminal tabs and pressing ```ctrl-c``` e.g. you've run ```tsc``` and ```nodemon``` using the steps outlined above. See the note above about the spinny thing and breaking out of a ```tsc``` watch. Also make sure that test monitors are not running as this might cause unknown stuff to occur. 

Just press ```F5``` and the app should build, and a debugger will attach ready for you to debug. Thanks to [source maps](https://code.visualstudio.com/docs/languages/typescript#_javascript-source-map-support) you create all your breakpoints in your TS files and VS Code will manage breaking the right spot (even though it's running the transpiled .js files)

<img src="https://user-images.githubusercontent.com/5225782/27891765-09a6a570-623f-11e7-9c5d-daab48561598.PNG" width="720" alt="debugging in code"/>

### Normal Test

*You're working on unit/integration tests. You want them to just run as you work.*



### Debug Test




## Links

- [BotBoiler on GitHub](https://github.com/MSFTAuDX/BotBoiler)
- [Getting started with the Bot Builder and the Bot Framework](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-quickstart)
- [Getting started with the Bot Framework Emulator](https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator)
    - [Bot Framework Emulator Downloads](https://github.com/Microsoft/BotFramework-Emulator/releases)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Visual Studio code and Typescript](https://code.visualstudio.com/docs/languages/typescript)
