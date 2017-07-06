import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import { serviceBase } from './../../../system/services/serviceBase';
import * as contracts  from '../../../system/contract/contracts';

import * as modelContracts from '../../modelContracts';

@injectable()
export default class qnaComponent extends serviceBase implements modelContracts.IQnaComponent {
    
    private _netClient:contracts.INetClient

    constructor(@inject(contracts.contractSymbols.INetClient) netClient:contracts.INetClient) {
        super();
        this._netClient = netClient;
    }

    async getAnswer(question: string): Promise<modelContracts.IQnAAnswer> {        
        const bodyText = { question: question };
        const url = `https://westus.api.cognitive.microsoft.com`;
        const path = `/qnamaker/v1.0/knowledgebases/${this.config.qna_id}/generateAnswer`;
        
        this.logger.log(`Url: ${url}/${path} Question: ${question}`);


        try{
            var result = await this._netClient.postJson<any, modelContracts.IQnAAnswer>(url, path, bodyText,  
                {'Ocp-Apim-Subscription-Key':this.config.qna_subs}); 
            return result;
        }catch(e){
            return e;
        }
    }
}