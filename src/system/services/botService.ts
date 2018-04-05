import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";
import { serviceBase } from "./serviceBase";

/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export class botService extends serviceBase implements contracts.IBotService {
    /**
     * 
     * @param  {} @inject(contracts.contractSymbols.IHostService
     * @param  {contracts.IHostService} hostService
     * @param  {} @inject("Factory<IDialog>"
     * @param  {()=>contracts.IDialog} dialogs
     */
    constructor( @inject(contracts.contractSymbols.IHostService) hostService: contracts.IHostService        
        ) {
        super();

        
    }

     /**
     * Boot the bot - creates a connector, bot and registers the dynamic dialogs. 
     */
    public boot() {

    }
}

