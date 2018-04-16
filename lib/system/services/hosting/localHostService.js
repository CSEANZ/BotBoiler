"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const serviceBase_1 = require("../serviceBase");
class localHostService extends serviceBase_1.configBase {
    constructor() {
        super();
    }
    init(connector /*connector:builder.ChatConnector*/) {
        this.log("Local Context");
        this._server = restify.createServer();
        this._server.listen(this.config.port, () => {
            console.log(`${this._server.name} listening to ${this._server.url}`);
        });
        this._server.post('/api/messages', connector.listen());
    }
    log(message) {
        console.log(message);
    }
    get export() {
        return null;
    }
}
exports.localHostService = localHostService;
//# sourceMappingURL=localHostService.js.map