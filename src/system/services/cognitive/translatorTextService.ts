import { injectable, inject } from "inversify";
import { IConfig } from "../../contract/systemEntities";
import { serviceBase } from '../../services/serviceBase'
import * as systemContracts from '../../contract/contracts';
import * as xmldom from "xmldom";

@injectable()
export class TranslatorTextService extends serviceBase implements systemContracts.ITranslatorTextService {

    private _netClient: systemContracts.INetClient
    
    constructor( @inject(systemContracts.contractSymbols.INetClient) netClient: systemContracts.INetClient) {
        super();
        this._netClient = netClient;

    }

    public async Translate(text: string, to: string, from?: string): Promise<string> {
        if (text == null || text == '' || text.length == 0) return;
        let url = `${this.config.translatorTextAPIUrl}/Translate?text=${text}`;
        let key = this.config.translatorTextAPIKey;
        let headers = {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': key
        }
        let result = await this._netClient.getJson(url, headers);
        return result;
    }

    public async Detect(text: string): Promise<string> {

        if (text == null || text == '' || text.length == 0) return;
        let url = `${this.config.translatorTextAPIUrl}/Detect?text=${text}`;
        let key = this.config.translatorTextAPIKey;
        let headers = {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': key
        }
        let result = await this._netClient.getJson(url, headers);
    
         var parser=new  xmldom.DOMParser();
         var lang= parser.parseFromString(result.body).firstChild.firstChild["data"];
       
        return lang;
    }

}







export default { TranslatorTextService }