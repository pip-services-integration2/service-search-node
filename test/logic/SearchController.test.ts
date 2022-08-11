// const assert = require('chai').assert;

// import { ConfigParams } from 'pip-services3-commons-nodex';
// import { Descriptor } from 'pip-services3-commons-nodex';
// import { References } from 'pip-services3-commons-nodex';
// import { FilterParams } from 'pip-services3-commons-nodex';
// import { PagingParams } from 'pip-services3-commons-nodex';

// import { SearchRecordV1 } from '../../src/data/version1/SearchRecordV1';
// import { SearchMemoryPersistence } from '../../src/persistence/SearchMemoryPersistence';
// import { SearchController } from '../../src/logic/SearchController';
// import { TestModel } from '../data/TestModel';
// import { reverse } from 'dns';

// const RECORD1: SearchRecordV1 = TestModel.createSearchRecord1();
// const RECORD2: SearchRecordV1 = TestModel.createSearchRecord2();

// suite('SearchController', () => {
//     let persistence: SearchMemoryPersistence;
//     let controller: SearchController;

//     setup(async () => {
//         persistence = new SearchMemoryPersistence();
//         persistence.configure(new ConfigParams());

//         controller = new SearchController();
//         controller.configure(new ConfigParams());

//         let references = References.fromTuples(
//             new Descriptor('service-search', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('service-search', 'controller', 'default', 'default', '1.0'), controller
//         );

//         controller.setReferences(references);

//         await persistence.open(null);
//     });

//     teardown(async () => {
//         await persistence.close(null);
//     });

//     test('CRUD Operations', async () => {
//         let record1: SearchRecordV1;

//         // Create the first record
//         let record = await controller.setRecord(null, RECORD1);

//         TestModel.assertEqualSearchRecord(record, RECORD1);

//         // Create the second record
//         record = await controller.setRecord(null, RECORD2);

//         TestModel.assertEqualSearchRecord(record, RECORD2);

//         // Get all records
//         let page = await controller.getRecords(null, new FilterParams(), new PagingParams(), null);

//         assert.isObject(page);
//         assert.lengthOf(page.data, 2);

//         record1 = page.data[0];

//         // Update the record
//         record1.field1 = 'Updated Field1';

//         record = await controller.updateRecord(null, record1);

//         assert.isObject(record);
//         assert.equal(record1.id, record.id);
//         assert.equal('Updated Field1', record.field1);

//         // Delete the record
//         record = await controller.deleteRecordById(null, record1.id);

//         assert.isObject(record);
//         assert.equal(record1.id, record.id);

//         // Try to get deleted record
//         record = await controller.getRecordById(null, record1.id);

//         assert.isNull(record || null);
//     });
// });