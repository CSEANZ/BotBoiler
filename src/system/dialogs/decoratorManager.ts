
let DecoratorTypes = {
    PromptConfig : "boiler_prompts",
    Trigger: "boiler_trigger"
}

let PromptTypes = {
    TextPrompt: "TextPrompt",
    DatetimePrompt: "DatetimePrompt"
}


export default class decoratorManager{    

    public pushConfig(property: string, target, config){
        var cfg = this.getConfig(property, target);
        cfg.push(config);
        this.setConfig(property, target, config);

    }

    public setConfig(property: string, target, config){
        var cfgNode = target._boilerconfig;

        if(!cfgNode){
            cfgNode = {};
        }
        cfgNode[property] = config; 

        target._boilerconfig = cfgNode;
    }

    public getConfig(property: string, target): any[]{
        var cfgNode = target._boilerconfig;

        if(!cfgNode){
            cfgNode = {};
        }
        
        var promptconfig = cfgNode[property];
    
        if(!promptconfig){
            promptconfig = [];
        }
    
        return promptconfig;
    }
}

var DecoratorManager = new decoratorManager();

export {DecoratorManager, DecoratorTypes, PromptTypes};