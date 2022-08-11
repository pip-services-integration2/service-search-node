"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMongoDbPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_mongodb_nodex_1 = require("pip-services3-mongodb-nodex");
class SearchMongoDbPersistence extends pip_services3_mongodb_nodex_1.IdentifiableMongoDbPersistence {
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
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
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
    composeSort(sort) {
        sort = sort || new pip_services3_commons_nodex_1.SortParams();
        let sortMap = {};
        sort.forEach(sortField => {
            sortMap[sortField.name] = sortField.ascending ? 1 : -1;
        });
        return sortMap;
    }
    getPageByFilter(correlationId, filter, paging, sort) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, this.composeSort(sort), null);
        });
    }
}
exports.SearchMongoDbPersistence = SearchMongoDbPersistence;
//# sourceMappingURL=SearchMongoDbPersistence.js.map