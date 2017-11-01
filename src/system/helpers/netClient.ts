import * as restify from 'restify';
import * as contracts from "../contract/contracts";
import { injectable } from "inversify";
// import * as xml2js from "xml2js"

@injectable()
export class netClient implements contracts.INetClient {

    public async getJson(url: string, headers?: any): Promise<any> {
        return new Promise<any>((good, bad) => {

            var clientOptions: restify.ClientOptions = {
                url: url
            }

            if (headers) {
                clientOptions.headers = headers;
            }
            var options = {
                // retry: {
                //     'retries': 0
                // },
                // agent: false
            };

            var jsonClient = restify.createJsonClient(clientOptions);

            jsonClient.get(options, function (err: any, req: restify.Request, res: any, obj: any) {
                if (err) {
                    bad(err);
                    return;
                }
                
                // if(res.body.indexOf('xmlns="http://schemas.microsoft.com/2003/10/Serialization/"') > -1) {
                //     var parser = new xml2js.Parser();
                    
                //                     parser.parseString(res.body, (err, result) => {
                //                         console.log("parser result");
                //                         console.log(result);
                //                         Jsonresult=res.body
                //                     });
                //     }

                // console.log("===>res");
                // console.log(res.body);
                // console.log(res);
                good(res);
                
                //     let regex='^<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">(.*)</string>$';
                //     var r=res.body.match(regex)
                //    console.log(r[1]);
                //     good(r[1]);
            });
        });
    }
    public async postJson<TUpload, TResult>(url: string, path: string, postData: TUpload, headers?: any): Promise<TResult> {
        return new Promise<TResult>((good, bad) => {

            var clientOptions: restify.ClientOptions = {
                url: url
            }

            if (headers) {
                clientOptions.headers = headers;
            }

            var jsonClient = restify.createJsonClient(clientOptions);

            jsonClient.post(path, postData, (err, req, res, obj: TResult) => {
                if (err) {
                    bad(err);
                    console.log("err");
                    console.log(err);
                    return;
                }
                good(obj);
            })
        });
    }
}