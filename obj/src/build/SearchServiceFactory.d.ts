import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
export declare class SearchServiceFactory extends Factory {
    static MemoryPersistenceDescriptor: Descriptor;
    static FilePersistenceDescriptor: Descriptor;
    static MongoDbPersistenceDescriptor: Descriptor;
    static ElasticPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static CommandableHttpServiceV1Descriptor: Descriptor;
    constructor();
}
