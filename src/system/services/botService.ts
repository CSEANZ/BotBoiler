import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

import { BotStateSet, BotFrameworkAdapter } from 'botbuilder';





/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export class botService extends serviceBase implements contracts.IBotService {    

   
    
    constructor(
        
    )
    {
        super();   
        
        
    }

    /**
    * Boot the bot - creates a connector, bot and registers the dynamic dialogs. 
    */
    public boot() {
        //this.hostService.init();

    }
}


