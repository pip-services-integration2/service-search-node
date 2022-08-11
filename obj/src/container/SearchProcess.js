"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
const SearchServiceFactory_1 = require("../build/SearchServiceFactory");
class SearchProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super('service-search', 'Practice records microservice');
        this._factories.add(new SearchServiceFactory_1.SearchServiceFactory());
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory());
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory());
    }
}
exports.SearchProcess = SearchProcess;
//# sourceMappingURL=SearchProcess.js.map