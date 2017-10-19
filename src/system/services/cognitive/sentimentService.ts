import { injectable, inject } from "inversify";
import * as serviceContracts from "../../contract/contracts";

import { IConfig } from "../../contract/systemEntities";
import { serviceBase } from '../../services/serviceBase'
import * as systemContracts from '../../contract/contracts';

@injectable()
export class SentimentService extends serviceBase implements serviceContracts.ISentimentService {

    private _netClient: systemContracts.INetClient
    /**
     *
     */
    constructor( @inject(systemContracts.contractSymbols.INetClient) netClient: systemContracts.INetClient) {
        super();
        this._netClient = netClient;

    }

    public async GetSentiment(text: string): Promise<number> {

        if (text.length >= 0) {

            if (text == null || text == '') return;
            let _sentimentUrl = this.config.sentimentUrl;
            let _sentimentId = 'broker-bot';
            let _sentimentKey = this.config.sentimentkey;

            let options = {
                url: _sentimentUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': _sentimentKey
                },
                json: true,
                body: {
                    "documents": [
                        {
                            "language": "en",
                            "id": _sentimentId,
                            "text": text
                        }
                    ]
                }
            };

            let result = await this._netClient.postJson<any, any>(options.url, '/text/analytics/v2.0/sentiment/',
                options.body, { 'Ocp-Apim-Subscription-Key': this.config.sentimentkey });

            if (result) {
                let score = result.documents[0].score || null;
                return score;
            }
            return 0.5;
        }
    }




}


export default { SentimentService }