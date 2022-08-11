import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { SearchMemoryPersistence } from '../persistence/SearchMemoryPersistence';
import { SearchFilePersistence } from '../persistence/SearchFilePersistence';
import { SearchMongoDbPersistence } from '../persistence/SearchMongoDbPersistence';
import { SearchController } from '../logic/SearchController';
import { SearchCommandableHttpServiceV1 } from '../services/version1/SearchCommandableHttpServiceV1';
// import { SearchElasticPersistence } from '../persistence/SearchElasticPersistence';

export class SearchServiceFactory extends Factory{
    public static MemoryPersistenceDescriptor = new Descriptor('service-search', 'persistence', 'memory', '*', '1.0');
    public static FilePersistenceDescriptor = new Descriptor('service-search', 'persistence', 'file', '*', '1.0');
    public static MongoDbPersistenceDescriptor = new Descriptor('service-search', 'persistence', 'mongodb', '*', '1.0');
    public static ElasticPersistenceDescriptor = new Descriptor('service-search', 'persistence', 'elastic', '*', '1.0');
    public static ControllerDescriptor = new Descriptor('service-search', 'controller', 'default', '*', '1.0');
    public static CommandableHttpServiceV1Descriptor = new Descriptor('service-search', 'service', 'commandable-http', '*', '1.0');
    
    constructor(){
        super();

        this.registerAsType(SearchServiceFactory.MemoryPersistenceDescriptor, SearchMemoryPersistence);
        this.registerAsType(SearchServiceFactory.FilePersistenceDescriptor, SearchFilePersistence);
        this.registerAsType(SearchServiceFactory.MongoDbPersistenceDescriptor, SearchMongoDbPersistence);
        // this.registerAsType(SearchServiceFactory.ElasticPersistenceDescriptor, SearchElasticPersistence);
        this.registerAsType(SearchServiceFactory.ControllerDescriptor, SearchController);
        this.registerAsType(SearchServiceFactory.CommandableHttpServiceV1Descriptor, SearchCommandableHttpServiceV1);
    }
}