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
exports.SearchMemoryPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
class SearchMemoryPersistence extends pip_services3_data_nodex_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
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
        const intersection = (arr, ...args) => arr.filter(item => args.every(arr => arr.includes(item)));
        return (item) => {
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
    composeSort(sort) {
        sort = sort || new pip_services3_commons_nodex_1.SortParams();
        if (sort.some(item => item.name == 'type'))
            return function (item) { return item.type; };
        if (sort.some(item => item.name == 'time'))
            return function (item) { return item.time; };
        return null;
    }
    getPageByFilter(correlationId, filter, paging, sort) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, this.composeSort(sort), null);
        });
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.type, search))
            return true;
        if (this.matchString(item.subtype, search))
            return true;
        if (this.matchString(item.name, search))
            return true;
        if (this.matchString(item.field1, search))
            return true;
        if (this.matchString(item.field2, search))
            return true;
        if (this.matchString(item.field3, search))
            return true;
        if (this.matchString(item.content, search))
            return true;
        return false;
    }
}
exports.SearchMemoryPersistence = SearchMemoryPersistence;
//# sourceMappingURL=SearchMemoryPersistence.js.map