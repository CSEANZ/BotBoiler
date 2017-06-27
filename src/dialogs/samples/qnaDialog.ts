import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";

import * as contracts  from '../../system/contract/contracts';
import { serviceBase } from "../../system/services/serviceBase";

interface IQnAAnswer {
    answer: string;
    score: number;
}

@injectable()
export default class luisDialog extends serviceBase implements contracts.IDialog{
    public id:string = 'qna';
    public name:string ='qna';
    public trigger:RegExp = /^ask$/i
    
    private _netClient:contracts.INetClient;
   
    constructor(@inject(contracts.contractSymbols.INetClient) netClient:contracts.INetClient) {
        super();        
        this._netClient = netClient;    
    }

    public get waterfall(): builder.IDialogWaterfallStep[]{
        return [this.step1, this.step2.bind(this)];
    }

    public step1(session: builder.Session, args: any, next: Function){
        builder.Prompts.text(session, `Okay - ask away!`);        
    }

    public async step2(session: builder.Session, results: any, next: Function) {
            const question = results.response;
            
            if (!question) {
                session.endConversation(`Sorry, I can't answer that question.`);
                return;
            }

            session.sendTyping();
            
            const bodyText = { question: question };
            const url = `https://westus.api.cognitive.microsoft.com`;
            const path = `/qnamaker/v1.0/knowledgebases/${this.config.KBID}/generateAnswer`;
            
            try{
                var result = await this._netClient.postJson<any, IQnAAnswer>(url, path, bodyText,  
                    {'Ocp-Apim-Subscription-Key':this.config.subscription});            
            
                if (result.score > 50) {
                    session.endConversation(result.answer);
                } else if (result.score > 0) {
                    session.send(`I'm not sure if this is right, but here's what I know...`);
                    session.endConversation(result.answer);
                } else {
                    session.endConversation(`I don't have that answer.`);
                }
            }catch(e){
                this.logger.log(e);
            }
          
           
        }
}