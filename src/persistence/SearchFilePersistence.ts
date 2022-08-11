import { JsonFilePersister } from 'pip-services3-data-nodex';

import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
import { SearchMemoryPersistence } from './SearchMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-nodex';

export class SearchFilePersistence extends SearchMemoryPersistence {
    protected _persister: JsonFilePersister<SearchRecordV1>;

    constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<SearchRecordV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams) {
        super.configure(config);
        this._persister.configure(config);
    }
    
}