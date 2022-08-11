const assert = require('chai').assert;
const restify = require('restify');

import { ConfigParams, SortParams, SortField } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { SearchRecordV1 } from '../../../src/data/version1/SearchRecordV1';
import { SearchMemoryPersistence } from '../../../src/persistence/SearchMemoryPersistence';
import { SearchController } from '../../../src/logic/SearchController';
import { SearchCommandableHttpServiceV1 } from '../../../src/services/version1/SearchCommandableHttpServiceV1';
import { TestModel } from '../../data/TestModel';

const RECORD1: SearchRecordV1 = TestModel.createSearchRecord1();
const RECORD2: SearchRecordV1 = TestModel.createSearchRecord2();
const RECORD3: SearchRecordV1 = TestModel.createSearchRecord3();

var httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('SearchCommandableHttpServiceV1', () => {
    let persistence: SearchMemoryPersistence;
    let controller: SearchController;
    let service: SearchCommandableHttpServiceV1;
    let rest: any;

    setup(async () => {
        let url = "http://localhost:3000";
        rest = restify.createJsonClient({ url: url, version: '*' });

        persistence = new SearchMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new SearchController();
        controller.configure(new ConfigParams());

        service = new SearchCommandableHttpServiceV1();
        service.configure(httpConfig);

        let references = References.fromTuples(
            new Descriptor('service-search', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-search', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-search', 'service', 'http', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        await persistence.open(null);
        await service.open(null);
    });

    teardown(async () => {
        await service.close(null);
        await persistence.close(null);
    });

    test('CRUD Operations', async () => {
        let record1: SearchRecordV1;
        
        // Create the first record
        let record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/set_record',
                {
                    record: RECORD1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        TestModel.assertEqualSearchRecord(record, RECORD1);

        // Create the second record
        record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/set_record',
                {
                    record: RECORD2
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        TestModel.assertEqualSearchRecord(record, RECORD2);

        // Create the third record
        record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/set_record',
                {
                    record: RECORD3
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });
        
        TestModel.assertEqualSearchRecord(record, RECORD3);

        // Get all records
        let page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/get_records',
                {
                    filter: new FilterParams(),
                    paging: new PagingParams(),
                    sort: new SortParams()
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        record1 = page.data[0];

        // Update the record
        record1.name = 'Name Name';

        record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/update_record',
                {
                    record: record1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(record);
        assert.equal(record1.id, record.id);
        assert.equal('Name Name', record.name);

        // Delete the record
        record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/delete_record_by_id',
                {
                    record_id: record1.id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(record);
        assert.equal(record1.id, record.id);

        // Try to get deleted record
        record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/get_record_by_id',
                {
                    record_id: record1.id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // assert.isEmpty(record || null);
    });

    test('Sorting', async () => {
        // Create the first record
        let record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/set_record',
                {
                    record: RECORD1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        TestModel.assertEqualSearchRecord(record, RECORD1);


        // Create the second record
        record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/set_record',
                {
                    record: RECORD2
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        TestModel.assertEqualSearchRecord(record, RECORD2);

        // Create the third record
        record = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/set_record',
                {
                    record: RECORD3
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        TestModel.assertEqualSearchRecord(record, RECORD3);

        await new Promise(r => setTimeout(r, 100));

        // Sort by type
        let page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/get_records',
                {
                    filter: new FilterParams(),
                    paging: new PagingParams(),
                    sort: new SortParams(new SortField('type', true))
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.lengthOf(page.data, 3);

        assert.equal(page.data[0].id, '1');
        assert.equal(page.data[1].id, '3');
        assert.equal(page.data[2].id, '2');

        // Sort by time
        page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/search/get_records',
                {
                    filter: new FilterParams(),
                    paging: new PagingParams(),
                    sort: new SortParams(new SortField('time', true))
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.lengthOf(page.data, 3);

        assert.equal(page.data[0].id, '2');
        assert.equal(page.data[1].id, '1');
        assert.equal(page.data[2].id, '3');
    });
});