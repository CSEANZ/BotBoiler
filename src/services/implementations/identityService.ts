import * as base64 from 'base-64';
import { injectable, inject } from "inversify";
import * as jwt from 'jsonwebtoken';
import * as xmldom from "xmldom";
import * as serviceContracts from '../serviceContracts';
import * as contracts from "../../system/contract/contracts";
import { IConfig } from "../../system/contract/systemEntities";
import { serviceBase } from '../../system/services/serviceBase'
import * as systemContracts from '../../system/contract/contracts';

@injectable()
export class IdentityService implements serviceContracts.IIdentityService {
    private _config: IConfig;
    private _logService: systemContracts.ILogService;
    private _netClient: systemContracts.INetClient;

    constructor(
        @inject(contracts.contractSymbols.IConfig) config: IConfig,
        @inject(systemContracts.contractSymbols.INetClient) netClient: systemContracts.INetClient,
        @inject(systemContracts.contractSymbols.ILogService) logService: systemContracts.ILogService) {

        this._config = config;
        this._logService = logService;
        this._netClient = netClient;
    }

    async GetUser(bearer: string): Promise<string> {
        this.Log('\nGet User\n');

        if (bearer) {
            let options = {
                url: 'https://graph.microsoft.com/v1.0/me',
                headers: {
                    'Authorization': 'Bearer ' + bearer
                },
            };

            try {
                let result = await this._netClient.getJson(options.url, options.headers);

                let userPrincipalName = JSON.parse(result.body).userPrincipalName;

                this.Log(userPrincipalName);

                return userPrincipalName;
            }
            catch (error) {
                let code = error.body['odata.error'].code;

                this.Log(code);

                throw code;
            }
        }
    }

    async VerifyIdToken(idToken: string, url: string): Promise<boolean> {
        this.Log('\nVerify Id Token\n');

        let alg = this.GetAlg(idToken);

        this.Log('alg: ' + alg);

        let kid = this.GetKid(idToken);

        this.Log('kid: ' + kid);

        let key = await this.GetPublicKey(kid, url);

        if (key === null) return false;

        this.Log('x5c: ' + key);

        key = this.FormatKey(key);

        this.Log(key);

        let decoded = jwt.verify(
            idToken,
            key,
            { algorithms: [alg] });

        this.Log(decoded);

        return true;
    }

    // See https://github.com/auth0/node-jsonwebtoken/issues/68 or https://github.com/matvelloso/AADNodeJWT/blob/master/aadJwt.js
    private FormatKey(key: string) {
        var beginCert = "-----BEGIN CERTIFICATE-----";
        var endCert = "-----END CERTIFICATE-----";

        key = key.replace("\n", "");
        key = key.replace(beginCert, "");
        key = key.replace(endCert, "");

        var result = beginCert;

        while (key.length > 0) {

            if (key.length > 64) {
                result += "\n" + key.substring(0, 64);
                key = key.substring(64, key.length);
            }
            else {
                result += "\n" + key;
                key = "";
            }
        }

        if (result[result.length] != "\n") {
            result += "\n";
        }

        result += endCert + "\n";

        return result;
    }

    private GetAlg(bearer: string): string {
        let token = bearer.split('.')[0];

        let decoded = base64.decode(token);

        return JSON.parse(decoded).alg;
    }

    private GetKid(bearer: string): string {
        let token = bearer.split('.')[0];

        let decoded = base64.decode(token);

        return JSON.parse(decoded).kid;
    }

    private async GetPublicKey(kid: string, url: string): Promise<string> {
        let options = {
            url: url
        };

        try {
            let result = await this._netClient.getJson(options.url);

            let jwks_uri = JSON.parse(result.body).jwks_uri;

            options = {
                url: jwks_uri,
            };

            result = await this._netClient.getJson(options.url);

            let keys = JSON.parse(result.body).keys;

            for (let i = 0; i < keys.length; i++) {
                if (keys[i].kid === kid) {
                    return keys[i].x5c[0];
                }
            }

            return null;
        }
        catch (error) {
            this.Log(error);

            throw error;
        }
    }

    private Log(message: string) {
        this._logService.log(message);
    }
}

export default { IdentityService }