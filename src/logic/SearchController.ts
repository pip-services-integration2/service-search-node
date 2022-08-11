import { FilterParams, SortParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';

import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
import { ISearchPersistence } from '../../src/persistence/ISearchPersistence';
import { ISearchController } from './ISearchController';
import { SearchCommandSet } from './SearchCommandSet';

export class SearchController implements ISearchController, IConfigurable, IReferenceable, ICommandable {
    private _persistence: ISearchPersistence;
    private _commandSet: SearchCommandSet;

    public constructor() { }

    public configure(config: ConfigParams): void {

    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<ISearchPersistence>(
            new Descriptor('service-search', 'persistence', '*', '*', '1.0')
        );
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new SearchCommandSet(this);
        }

        return this._commandSet;
    }

    public async getRecords(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>> {
        return await this._persistence.getPageByFilter(correlationId, filter, paging, sort);
    }

    public async getRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1> {
        return await this._persistence.getOneById(correlationId, recordId);
    }

    public async setRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1> {
        return await this._persistence.create(correlationId, record);
    }

    public async updateRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1> {
        return await this._persistence.update(correlationId, record);
    }

    public async deleteRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1> {
        return await this._persistence.deleteById(correlationId, recordId);
    }

}