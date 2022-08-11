import { FilterParams, SortParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';

import { IdentifiableMemoryPersistence } from 'pip-services3-data-nodex';

import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
import { ISearchPersistence } from './ISearchPersistence';

export class SearchMemoryPersistence
    extends IdentifiableMemoryPersistence<SearchRecordV1, string>
    implements ISearchPersistence {

    constructor() {
        super();

        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let type = filter.getAsNullableString('type');
        let subtype = filter.getAsNullableString('subtype');
        let name = filter.getAsNullableString('name');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        let field1 = filter.getAsNullableString('field1');
        let field2 = filter.getAsNullableString('field2');
        let field3 = filter.getAsNullableString('field3');
        let tags = filter.getAsNullableArray('tags');
        let content = filter.getAsNullableString('content');
        let search = filter.getAsNullableString('search');

        const intersection = (arr, ...args) =>
            arr.filter(item => args.every(arr => arr.includes(item)))

        return (item: SearchRecordV1) => {
            if (search != null && !this.matchSearch(item, search))
                return false;
            if (id != null && item.id != id)
                return false;
            if (type != null && item.type != type)
                return false;
            if (subtype != null && item.subtype != subtype)
                return false;
            if (name != null && item.name != name)
                return false;
            if (fromTime != null && item.time < fromTime)
                return false;
            if (toTime != null && item.time > toTime)
                return false;
            if (field1 != null && item.field1 != field1)
                return false;
            if (field2 != null && item.field2 != field2)
                return false;
            if (field3 != null && item.field3 != field3)
                return false;
            if (content != null && !this.matchString(item.content, content))
                return false;
            if (tags != null && item.tags != null && intersection(tags, item.tags).length != item.tags.length)
                return false;
            return true;
        };
    }

    private composeSort(sort: SortParams) {
        sort = sort || new SortParams();

        if (sort.some(item => item.name == 'type'))
            return function (item) { return item.type; }

        if (sort.some(item => item.name == 'time'))
            return function (item) { return item.time; }

        return null;
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, this.composeSort(sort), null);
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: SearchRecordV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.type, search)) return true;
        if (this.matchString(item.subtype, search)) return true;
        if (this.matchString(item.name, search)) return true;
        if (this.matchString(item.field1, search)) return true;
        if (this.matchString(item.field2, search)) return true;
        if (this.matchString(item.field3, search)) return true;
        if (this.matchString(item.content, search)) return true;
        return false;
    }
}