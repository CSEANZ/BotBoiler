# BotBoiler
Boilerplate code for Typescript based bots.

BotBoiler is base code to get you started with an enterprise scale Node+Typescript based bot. 

It's tenets are that it must be composable, testable, extensible, adhere to separation of concerns and above all be simple, elegant and maintainable.

## Getting Started

*Note* We are working on a [generator](https://github.com/MSFTAuDX/generator-botboiler) to help get started quickly which will be available soon. 

Clone [this](https://github.com/MSFTAuDX/BotBoiler) GitHub repo and  

## Working with the framework

This project and documentation is based on [Visual Studio Code](https://code.visualstudio.com/) but you can of course use any tool that works well with Node and Typescript!

There are a few modes of development you might like to choose depending on your development phase. 

### Normal Dev Iteration

Watch mode. You're working away and you want the code to recompile and the test bot server always be up to date. 

This mode is simple to start (instructions are for [Visual Studio Code](https://code.visualstudio.com/))

- Kick off a build using ```crtl-shift-b```. On the output screen you should see something like ```10:14:11 AM - Compilation complete. Watching for file changes.```
- Open a new terminal window (```ctrl-~``` is the default shortcut to bring this up.)
- Type ```npm run outputwatch``` to watch output file changes using nodemon. 
- Edit your files, connect to your bot and off you go!

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


### Debug Dev

### Normal Test

### Debug Test




## Links

- [BotBoiler on GitHub](https://github.com/MSFTAuDX/BotBoiler)
- [Visual Studio Code](https://code.visualstudio.com/)