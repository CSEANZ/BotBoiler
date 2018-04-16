"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let contractSymbols = {
    ILogService: Symbol("ILogService"),
    IConfig: Symbol("IConfig"),
    IBotService: Symbol("IBotService"),
    IHostService: Symbol("IHostService"),
    Storage: Symbol("Storage"),
    IStateService: Symbol("IStateService"),
    Startup: Symbol("Startup")
};
exports.contractSymbols = contractSymbols;
var serverTypes;
(function (serverTypes) {
    serverTypes[serverTypes["AzureFunctions"] = 0] = "AzureFunctions";
    serverTypes[serverTypes["AWSLambda"] = 1] = "AWSLambda";
    serverTypes[serverTypes["Local"] = 2] = "Local";
})(serverTypes = exports.serverTypes || (exports.serverTypes = {}));
//# sourceMappingURL=systemContracts.js.map