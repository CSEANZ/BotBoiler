

import * as builder from 'botbuilder';
import { IHostService } from "../../contracts/systemContracts";
import { serviceBase, configBase } from "../serviceBase";
import { BotAdapter, ConsoleAdapter, BotStateSet } from 'botbuilder';
import * as contracts from "../../contracts/systemContracts";
import { inject } from 'inversify';


export abstract class hostServiceBase extends configBase implements IHostService{
    
    

    protected BotStateSet: BotStateSet;
    constructor() {
        super();       
    }

    public init(){
        this.BotStateSet = new BotStateSet();
       // this.BotStateSet.use(this.conversationState, this.userState);
    }

    abstract log(message:string);
}