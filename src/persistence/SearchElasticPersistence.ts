
import { FilterParams, IReferences, ConfigParams, ConfigException, IdGenerator, SortParams } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IOpenable } from 'pip-services3-commons-nodex';
import { ICleanable } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { HttpConnectionResolver } from 'pip-services3-rpc-nodex';

import { ISearchPersistence } from './ISearchPersistence';
import { SearchRecordV1 } from '../data/version1';
import { rejects } from 'assert';
import { resolve } from 'path';

export class SearchElasticPersistence implements ISearchPersistence, IReferenceable, IConfigurable, IOpenable, ICleanable {
    private _connectionResolver: HttpConnectionResolver = new HttpConnectionResolver();

    private _index: string = 'search';
    private _type: string = 'search_records';
    private _reconnect: number = 60000;
    private _timeout: number = 30000;
    private _maxRetries: number = 3;

    private _maxPageSize: number = 1000;

    private _client: any = null;

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._connectionResolver.setReferences(references);
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {

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
    public isOpen(): boolean {
        return this._client != null;
    }

    /**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public async open(correlationId: string): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        let connection = await this._connectionResolver.resolve(correlationId);
        
        if (connection == null)
            throw new ConfigException(correlationId, 'NO_CONNECTION', 'Connection is not configured');

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

        await this.createIndexIfNeeded(correlationId, true);
    }

    private async createIndexIfNeeded(correlationId: string, force: boolean): Promise<void> {
        let exists = await this._client.indices.exists({ index: this._index });

        if (exists) return;

        try {
            await this._client.indices.create(
                {
                    index: this._index,
                    body: {
                        settings: {
                            number_of_shards: 1
                        }
                    }
                }
            );
        } catch(err) {
            // Skip already exist errors
            if (err && err.message.indexOf('resource_already_exists') >= 0)
                err = null;

            if (err) throw err;
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public async close(correlationId: string): Promise<void> {
        this._client = null;
    }

    public async clear(correlationId: string): Promise<void> {
        let exists = await this._client.indices.exists({ index: this._index });

        if (!exists) return;

        await this._client.indices.delete({index: this._index });
        await this.createIndexIfNeeded(correlationId, true);
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>> {

        let bodyQuery = this.composeFilter(filter);
        let bodySort = this.composeSort(sort);

        var records = [];

        let response = await this._client.search({
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

            if (!response._scroll_id) break;

            // now we can call scroll over and over
            response = await this._client.scroll({
                scrollId: response._scroll_id,
                // scroll: '10s'
            });

        } while (response.hits.total.value !== records.length)

        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let total = null;
        if (paging.total)
            total = records.length;

        if (skip > 0) {
            records = records.slice(skip);
        }

        records = records.slice(0, take);

        let page = new DataPage<SearchRecordV1>(records.map((value) => value['_source'].mappings), total);
        return page;
    }

    public async getOneById(correlationId: string, id: string): Promise<SearchRecordV1> {
        try {
            let response = await this._client.get({
                'index': this._index,
                'type': this._type,
                '_source': true,
                'id': id
            });

            return response['_source'].mappings;
        } catch (ex) {
            if (ex.message === 'Not Found') return null;
            else throw ex;
        }
    }

    public async create(correlationId: string, item: SearchRecordV1): Promise<SearchRecordV1> {
        item.id = item.id || IdGenerator.nextLong();

        await this._client.create({
            index: this._index,
            type: this._type,
            id: item.id,
            body: {
                mappings: item
            }
        });

        return item;
    }

    public async update(correlationId: string, item: SearchRecordV1): Promise<SearchRecordV1> {
        let doc = Object.assign({}, item);
        delete doc.id;

        await this._client.update({
            'index': this._index,
            'type': this._type,
            'id': item.id,
            'body': { 'doc': doc }
        });

        return item;
    }

    public async deleteById(correlationId: string, id: string): Promise<SearchRecordV1> {
        let item = await this.getOneById(correlationId, id);

        await this._client.delete({
            'index': this._index,
            'type': this._type,
            'id': id,
            'refresh': true
        });

        return item;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

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

            if (fromTime) timeRange['gte'] = fromTime;
            if (toTime) timeRange['lt'] = toTime;

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

    private composeSort(sort: SortParams): any {
        sort = sort || new SortParams();

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

    private isEmpty(obj): boolean {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }

        return true;
    }
}