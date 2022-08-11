import { FilterParams, SortParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';
import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
import { ISearchPersistence } from './ISearchPersistence';
export declare class SearchMongoDbPersistence extends IdentifiableMongoDbPersistence<SearchRecordV1, string> implements ISearchPersistence {
    constructor();
    private composeFilter;
    private composeSort;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>>;
}
