import { FilterParams } from 'pip-services3-commons-nodex';
import { SortParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
export interface ISearchPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>>;
    getOneById(correlationId: string, id: string): Promise<SearchRecordV1>;
    create(correlationId: string, item: SearchRecordV1): Promise<SearchRecordV1>;
    update(correlationId: string, item: SearchRecordV1): Promise<SearchRecordV1>;
    deleteById(correlationId: string, id: string): Promise<SearchRecordV1>;
}
