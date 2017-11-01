import { inject, injectable } from "inversify";
import * as contracts from "../contract/contracts";
import { serviceBase } from "./serviceBase";
import * as routerContracts from '../router/routerContracts';
import * as serviceContracts from '../../services/serviceContracts';
import * as systemContracts from '../../system/contract/contracts';

const CONTAINER = 'tokens';
const OPENID_CONFIGURATION = 'https://login.microsoftonline.com/6cd4db60-710f-48e7-b7f0-cb8aed573ca9/v2.0/.well-known/openid-configuration';

@injectable()
export class tokenService extends serviceBase implements contracts.ITokenService {
    private _identityService: serviceContracts.IIdentityService;

    private _bearer: string;
    private _channelId: string;
    private _conversationId: string;
    private _idToken: string;
    private _userId: string;

    constructor(
        @inject(serviceContracts.modelSymbols.IIdentityService) identityService: serviceContracts.IIdentityService,
        @inject(systemContracts.contractSymbols.ILogService) logService: systemContracts.ILogService
    ) {
        super();

        this._identityService = identityService;
    }

    init(bearer: string, channelId: string, conversationId: string, idToken: string, userId: string) {
        this._bearer = bearer;
        this._channelId = channelId;
        this._conversationId = conversationId;
        this._idToken = idToken;
        this._userId = userId;
    }

    async process() {
        let valid = await this._identityService.VerifyIdToken(this._idToken, OPENID_CONFIGURATION);

        if (valid) {
            let user = await this._identityService.GetUser(this._bearer);

            await this.PersistToken(user);
        }

        let isSignedIn = await super.isSignedIn(CONTAINER, this._channelId, this._conversationId, this._userId);

        this.log('\nLet\'s see if the Conversation is authorised?\n');

        if (isSignedIn)
        {
            this.log("Yes!");
        }
        else
        {
            this.log("Hmmm, after all our work, suspiciously no...");
        }
    }

    private async PersistToken(user: string) {
        this.log('\nPersist Token\n');

        await this.storageService.CreateContainer(CONTAINER);

        var token = {
            bearer: this._bearer,
            idToken: this._idToken,
            user: user
        };

        let json = JSON.stringify(token);

        let name = `${this._channelId}_${this._conversationId}_${this._userId}`;;

        await this.storageService.CreateBlockBlob(CONTAINER, name, json);

        this.log(`Blob ${name} created.`);
    }
}

export default { tokenService }