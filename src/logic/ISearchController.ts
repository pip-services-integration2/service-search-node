import { FilterParams } from 'pip-services3-commons-nodex';
import { SortParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';

import { SearchRecordV1 } from '../data/version1/SearchRecordV1';

export interface ISearchController {
    getRecords(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>>;

    getRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1>;

    setRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1>;

    updateRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1>;

    deleteRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1>;
}