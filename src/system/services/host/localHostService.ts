
import * as restify from 'restify';
import * as builder from 'botbuilder';
import { IHostService } from "../../contract/contracts";
import { serviceBase, configBase } from "../serviceBase";

export class localHostService extends configBase implements IHostService{

    private _server: restify.Server;

    constructor() {
        super();
    }

    init(connector:builder.ChatConnector){

        this.log("Local Context");

        this._server = restify.createServer();   

        this._server.listen(this.config.port, () => {
            console.log(`${this._server.name} listening to ${this._server.url}`);
        });

        this._server.post('/api/messages', connector.listen());
    }

    public log(message:string){
        console.log(message);
    }

    public get export():any{
        return null;
    }
}