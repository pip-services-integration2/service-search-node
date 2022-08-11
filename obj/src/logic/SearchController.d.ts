import { FilterParams, SortParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
import { ISearchController } from './ISearchController';
export declare class SearchController implements ISearchController, IConfigurable, IReferenceable, ICommandable {
    private _persistence;
    private _commandSet;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    getRecords(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>>;
    getRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1>;
    setRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1>;
    updateRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1>;
    deleteRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1>;
}
