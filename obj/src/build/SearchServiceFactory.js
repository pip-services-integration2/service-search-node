"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const SearchMemoryPersistence_1 = require("../persistence/SearchMemoryPersistence");
const SearchFilePersistence_1 = require("../persistence/SearchFilePersistence");
const SearchMongoDbPersistence_1 = require("../persistence/SearchMongoDbPersistence");
const SearchController_1 = require("../logic/SearchController");
const SearchCommandableHttpServiceV1_1 = require("../services/version1/SearchCommandableHttpServiceV1");
// import { SearchElasticPersistence } from '../persistence/SearchElasticPersistence';
class SearchServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(SearchServiceFactory.MemoryPersistenceDescriptor, SearchMemoryPersistence_1.SearchMemoryPersistence);
        this.registerAsType(SearchServiceFactory.FilePersistenceDescriptor, SearchFilePersistence_1.SearchFilePersistence);
        this.registerAsType(SearchServiceFactory.MongoDbPersistenceDescriptor, SearchMongoDbPersistence_1.SearchMongoDbPersistence);
        // this.registerAsType(SearchServiceFactory.ElasticPersistenceDescriptor, SearchElasticPersistence);
        this.registerAsType(SearchServiceFactory.ControllerDescriptor, SearchController_1.SearchController);
        this.registerAsType(SearchServiceFactory.CommandableHttpServiceV1Descriptor, SearchCommandableHttpServiceV1_1.SearchCommandableHttpServiceV1);
    }
}
exports.SearchServiceFactory = SearchServiceFactory;
SearchServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-search', 'persistence', 'memory', '*', '1.0');
SearchServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-search', 'persistence', 'file', '*', '1.0');
SearchServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-search', 'persistence', 'mongodb', '*', '1.0');
SearchServiceFactory.ElasticPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-search', 'persistence', 'elastic', '*', '1.0');
SearchServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor('service-search', 'controller', 'default', '*', '1.0');
SearchServiceFactory.CommandableHttpServiceV1Descriptor = new pip_services3_commons_nodex_1.Descriptor('service-search', 'service', 'commandable-http', '*', '1.0');
//# sourceMappingURL=SearchServiceFactory.js.map