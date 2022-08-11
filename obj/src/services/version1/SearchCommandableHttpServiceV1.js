"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCommandableHttpServiceV1 = void 0;
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class SearchCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/search');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-search', 'controller', '*', '*', '1.0'));
    }
}
exports.SearchCommandableHttpServiceV1 = SearchCommandableHttpServiceV1;
//# sourceMappingURL=SearchCommandableHttpServiceV1.js.map