import * as restify from 'restify';
import * as contracts from "../contract/contracts";
import { injectable } from "inversify";

@injectable()
export class netClient implements contracts.INetClient{
    
    public async getJson(url: string, headers?: any): Promise<any> {
        return new Promise<any>((good, bad) => {

            var clientOptions: restify.ClientOptions = {
                url: url
            }

            if (headers) {
                clientOptions.headers = headers;
            }
            var options = {
            };

            var jsonClient = restify.createJsonClient(clientOptions);

            jsonClient.get(options, function (err: any, req: restify.Request, res: any, obj: any) {
                if (err) {
                    bad(err);
                    return;
                }
                
                good(res);
                
            });
        });
    }

    public async postJson<TUpload, TResult>(url:string, path:string, postData:TUpload, headers?:any):Promise<TResult>{
        return new Promise<TResult>((good, bad)=>{
            
            var clientOptions:restify.ClientOptions = {
                url: url
            }

            if(headers){
                clientOptions.headers = headers;
            }
            
            var jsonClient = restify.createJsonClient(clientOptions); 
           
            jsonClient.post(path, postData,(err, req, res, obj: TResult)=>{
                if(err){
                    bad(err);
                    return;
                }
                good(obj);
            })
        });
    }
}