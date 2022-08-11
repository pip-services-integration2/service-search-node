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
exports.SearchElasticPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class SearchElasticPersistence {
    constructor() {
        this._connectionResolver = new pip_services3_rpc_nodex_1.HttpConnectionResolver();
        this._index = 'search';
        this._type = 'search_records';
        this._reconnect = 60000;
        this._timeout = 30000;
        this._maxRetries = 3;
        this._maxPageSize = 1000;
        this._client = null;
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._connectionResolver.configure(config);
        this._index = config.getAsStringWithDefault('index', this._index);
        this._type = config.getAsStringWithDefault('type', this._type);
        this._reconnect = config.getAsIntegerWithDefault('options.reconnect', this._reconnect);
        this._timeout = config.getAsIntegerWithDefault('options.timeout', this._timeout);
        this._maxRetries = config.getAsIntegerWithDefault('options.max_retries', this._maxRetries);
        this._maxPageSize = config.getAsIntegerWithDefault('options.max_page_size', this._maxPageSize);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._client != null;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen()) {
                return;
            }
            let connection = yield this._connectionResolver.resolve(correlationId);
            if (connection == null)
                throw new pip_services3_commons_nodex_1.ConfigException(correlationId, 'NO_CONNECTION', 'Connection is not configured');
            let uri = connection.getAsString('uri');
            let options = {
                apiVersion: "6.8",
                host: uri,
                requestTimeout: this._timeout,
                deadTimeout: this._reconnect,
                maxRetries: this._maxRetries
            };
            const { Client } = require('elasticsearch');
            this._client = new Client(options);
            yield this.createIndexIfNeeded(correlationId, true);
        });
    }
    createIndexIfNeeded(correlationId, force) {
        return __awaiter(this, void 0, void 0, function* () {
            let exists = yield this._client.indices.exists({ index: this._index });
            if (exists)
                return;
            try {
                yield this._client.indices.create({
                    index: this._index,
                    body: {
                        settings: {
                            number_of_shards: 1
                        }
                    }
                });
            }
            catch (err) {
                // Skip already exist errors
                if (err && err.message.indexOf('resource_already_exists') >= 0)
                    err = null;
                if (err)
                    throw err;
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._client = null;
        });
    }
    clear(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let exists = yield this._client.indices.exists({ index: this._index });
            if (!exists)
                return;
            yield this._client.indices.delete({ index: this._index });
            yield this.createIndexIfNeeded(correlationId, true);
        });
    }
    getPageByFilter(correlationId, filter, paging, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            let bodyQuery = this.composeFilter(filter);
            let bodySort = this.composeSort(sort);
            var records = [];
            let response = yield this._client.search({
                'index': this._index,
                'body': {
                    'query': bodyQuery,
                    'sort': bodySort
                }
            });
            do {
                response.hits.hits.forEach(function (hit) {
                    records.push(hit);
                });
                if (!response._scroll_id)
                    break;
                // now we can call scroll over and over
                response = yield this._client.scroll({
                    scrollId: response._scroll_id,
                    // scroll: '10s'
                });
            } while (response.hits.total.value !== records.length);
            paging = paging != null ? paging : new pip_services3_commons_nodex_2.PagingParams();
            let skip = paging.getSkip(-1);
            let take = paging.getTake(this._maxPageSize);
            let total = null;
            if (paging.total)
                total = records.length;
            if (skip > 0) {
                records = records.slice(skip);
            }
            records = records.slice(0, take);
            let page = new pip_services3_commons_nodex_3.DataPage(records.map((value) => value['_source'].mappings), total);
            return page;
        });
    }
    getOneById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this._client.get({
                    'index': this._index,
                    'type': this._type,
                    '_source': true,
                    'id': id
                });
                return response['_source'].mappings;
            }
            catch (ex) {
                if (ex.message === 'Not Found')
                    return null;
                else
                    throw ex;
            }
        });
    }
    create(correlationId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.id = item.id || pip_services3_commons_nodex_1.IdGenerator.nextLong();
            yield this._client.create({
                index: this._index,
                type: this._type,
                id: item.id,
                body: {
                    mappings: item
                }
            });
            return item;
        });
    }
    update(correlationId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            let doc = Object.assign({}, item);
            delete doc.id;
            yield this._client.update({
                'index': this._index,
                'type': this._type,
                'id': item.id,
                'body': { 'doc': doc }
            });
            return item;
        });
    }
    deleteById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = yield this.getOneById(correlationId, id);
            yield this._client.delete({
                'index': this._index,
                'type': this._type,
                'id': id,
                'refresh': true
            });
            return item;
        });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let criteria = [];
        let search = filter.getAsNullableString('search');
        if (search != null) {
            criteria.push({
                'multi_match': {
                    'query': search,
                    'fields': [
                        'mappings.type',
                        'mappings.subtype',
                        'mappings.name',
                        'mappings.field1',
                        'mappings.field2',
                        'mappings.field3',
                        'mappings.content'
                    ]
                }
            });
        }
        let id = filter.getAsNullableString('id');
        if (id != null) {
            criteria.push({ 'match': { 'mappings.id.keyword': id } });
        }
        let type = filter.getAsNullableString('type');
        if (type != null) {
            criteria.push({ 'match': { 'mappings.type.keyword': type } });
        }
        var subtype = filter.getAsNullableString('subtype');
        if (subtype != null) {
            criteria.push({ 'match': { 'mappings.subtype.keyword': subtype } });
        }
        var name = filter.getAsNullableString('name');
        if (name != null) {
            criteria.push({ 'match': { 'mappings.name.keyword': name } });
        }
        var description = filter.getAsNullableString('description');
        if (description != null) {
            criteria.push({ 'match': { 'mappings.description.keyword': description } });
        }
        var fromTime = filter.getAsNullableDateTime('from_time');
        var toTime = filter.getAsNullableDateTime('to_time');
        if (fromTime || toTime) {
            let timeRange = {};
            if (fromTime)
                timeRange['gte'] = fromTime;
            if (toTime)
                timeRange['lt'] = toTime;
            criteria.push({ 'range': { 'mappings.time': timeRange } });
        }
        var field1 = filter.getAsNullableString('field1');
        if (field1 != null) {
            criteria.push({ 'match': { 'mappings.field1.keyword': field1 } });
        }
        var field2 = filter.getAsNullableString('field2');
        if (field2 != null) {
            criteria.push({ 'match': { 'mappings.field2.keyword': field2 } });
        }
        var field3 = filter.getAsNullableString('field3');
        if (field3 != null) {
            criteria.push({ 'match': { 'mappings.field3.keyword': field3 } });
        }
        var tags = filter.getAsNullableArray('tags');
        if (tags != null) {
            tags.forEach(x => criteria.push({ 'term': { 'mappings.tags': x } }));
        }
        var content = filter.getAsNullableString('content');
        if (content != null) {
            criteria.push({ 'match': { 'mappings.content': content } });
        }
        return this.isEmpty(criteria) ? { 'match_all': {} } : { 'bool': { 'must': criteria } };
    }
    composeSort(sort) {
        sort = sort || new pip_services3_commons_nodex_1.SortParams();
        let sortMap = [];
        sort.forEach(sortField => {
            let name = sortField.name == 'time' ? 'time' : sortField.name + '.keyword';
            name = 'mappings.' + name;
            let condition = {};
            condition[name] = { 'order': sortField.ascending ? 'asc' : 'desc' };
            sortMap.push(condition);
        });
        return sortMap;
    }
    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }
}
exports.SearchElasticPersistence = SearchElasticPersistence;
//# sourceMappingURL=SearchElasticPersistence.js.map