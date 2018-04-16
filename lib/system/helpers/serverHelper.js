"use strict";
//Thanks to https://github.com/vjrantal/bot-sample/blob/master/index.js
Object.defineProperty(exports, "__esModule", { value: true });
const systemContracts_1 = require("../contracts/systemContracts");
class serverHelper {
    getServerType() {
        if (process.env.FUNCTIONS_EXTENSION_VERSION) {
            // If we are in the Azure Functions runtime.
            return systemContracts_1.serverTypes.AzureFunctions;
            // } else if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
            //     // If we are in the Serverless runtime.
        }
        else {
            // On other environments, use restify for handling requests.
            return systemContracts_1.serverTypes.Local;
        }
    }
}
exports.serverHelper = serverHelper;
//# sourceMappingURL=serverHelper.js.map