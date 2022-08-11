import { JsonFilePersister } from 'pip-services3-data-nodex';
import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
import { SearchMemoryPersistence } from './SearchMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-nodex';
export declare class SearchFilePersistence extends SearchMemoryPersistence {
    protected _persister: JsonFilePersister<SearchRecordV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
