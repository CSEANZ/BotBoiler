
import * as restify from 'restify';
import * as builder from 'botbuilder';
import { IHostService } from "../../../contract/contracts";
import { serviceBase } from "../../serviceBase";

export class localHostService extends serviceBase implements IHostService{

    private _server: restify.Server;

    constructor() {
        super();
    }

    init(connector:builder.ChatConnector){

        this._server = restify.createServer();   

        this._server.listen(this.config.port, () => {
            this.logger.log(`${this._server.name} listening to ${this._server.url}`);
        });

        this._server.post('/api/messages', connector.listen());
    }
}