import { HttpContext, IFunctionRequest, HttpStatusCodes } from 'azure-functions-typescript'
import startup from './startup';
import { contractSymbols, ILogService, ITokenService } from '../system/contract/contracts';
import { configBase } from '../system/services/serviceBase';
import { tokenService } from '../system/services/tokenService';

class App {
    private _logger: ILogService;
    private _tokenService: ITokenService;

    constructor() {
        this._tokenService = configBase.Container.get(contractSymbols.ITokenService);
        this._logger = configBase.Container.get(contractSymbols.ILogService);
    }

    async run(context, req): Promise<any> {
        this._logger.setLogCallback(context.log);

        try {
            this.log('Hi!');

            var bearer = req.headers.authorization.split('Bearer ')[1];
            var channelId = req.body.channelId;
            var conversationId = req.body.conversationId;
            var idToken = req.body.idToken;
            var userId = req.body.userId;

            this.log('Request\n');
            this.log('Bearer: ' + bearer);
            this.log('Channel Id: ' + channelId);
            this.log('Conversation Id: ' + conversationId);
            this.log('Id Token: ' + idToken);
            this.log('User Id: ' + userId);

            this._tokenService.init(bearer, channelId, conversationId, idToken, userId);

            await this._tokenService.process();

            this.log(':)');
        }
        catch (error) {
            this.log(error);

            this.log(':(');
        }
    }

    private log(message: string) {
        this._logger.log(message);
    }
}

let appStartup: startup = new startup();
let app = new App();

module.exports = function (context: HttpContext, req: IFunctionRequest) {
    app.run(context, req);
};