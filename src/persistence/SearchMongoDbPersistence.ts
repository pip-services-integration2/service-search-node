import { FilterParams, SortParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';

import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';

import { SearchRecordV1 } from '../data/version1/SearchRecordV1';
import { ISearchPersistence } from './ISearchPersistence';

export class SearchMongoDbPersistence
    extends IdentifiableMongoDbPersistence<SearchRecordV1, string>
    implements ISearchPersistence {
    constructor() {
        super('search');
        this._maxPageSize = 1000;

        this.ensureIndex({
            type: 1, 
            subtype: 1, 
            name: 1, 
            time: 1, 
            field1: 1, 
            field2: 1, 
            field3: 1,
            content: 1
        });
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ 'type': { $regex: searchRegex } });
            searchCriteria.push({ 'subtype': { $regex: searchRegex } });
            searchCriteria.push({ 'name': { $regex: searchRegex } });
            searchCriteria.push({ 'field1': { $regex: searchRegex } });
            searchCriteria.push({ 'field2': { $regex: searchRegex } });
            searchCriteria.push({ 'field3': { $regex: searchRegex } });
            searchCriteria.push({ 'content': { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let type = filter.getAsNullableString('type');
        if (type != null) {
            criteria.push({ type: type });
        }

        var subtype = filter.getAsNullableString('subtype');
        if (subtype != null) {
            criteria.push({ subtype: subtype });
        }

        var name = filter.getAsNullableString('name');
        if (name != null) {
            criteria.push({ name: name });
        }

        var fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null) {
            criteria.push({
                time: { $gte: fromTime }
            });
        }

        var toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null) {
            criteria.push({
                time: { $lt: toTime }
            });
        }

        var field1 = filter.getAsNullableString('field1');
        if (field1 != null) {
            criteria.push({ field1: field1 });
        }

        var field2 = filter.getAsNullableString('field2');
        if (field2 != null) {
            criteria.push({ field2: field2 });
        }

        var field3 = filter.getAsNullableString('field3');
        if (field3 != null) {
            criteria.push({ field3: field3 });
        }

        var _tags = filter.getAsNullableArray('tags');
        if (_tags != null) {
            criteria.push({
                tags: { $all: [..._tags] }
            });
        }

        var content = filter.getAsNullableString('content');
        if (content != null) {
            let searchRegex = new RegExp(content, "i");
            criteria.push({ 'content': { $regex: searchRegex } });
        }

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    private composeSort(sort: SortParams) {
        sort = sort || new SortParams();
        
        let sortMap = {};
        sort.forEach(sortField => {
            sortMap[sortField.name] = sortField.ascending ? 1 : -1;
        });

        return sortMap;
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, this.composeSort(sort), null);
    }
}