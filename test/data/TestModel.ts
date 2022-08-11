import { SearchRecordV1 } from "../../src";
import { DateTimeConverter } from "pip-services3-commons-nodex";

let assert = require('chai').assert;

export class TestModel {
    static createSearchRecord1(): SearchRecordV1 {
        return {
            id: '1',
            type: 'Test_type1',
            name: 'Test_name1',
            time: new Date(Date.now()),
            refs: [
                {
                    id: '1',
                    type: 'type1',
                    name: 'name1',
                    parent: true,
                    subtype: 'subtype1'
                }
            ],
            tags: ['red']
        };
    }

    static createSearchRecord2(): SearchRecordV1 {
        return {
            id: '2',
            type: 'Test_type2',
            name: 'Test_name2',
            time: new Date(2014, 1, 1),
            refs: [
                {
                    id: '1',
                    type: 'type1',
                    name: 'name1',
                    parent: true,
                    subtype: 'subtype1'
                }
            ],
            tags: ['black']
        };
    }
    
    static createSearchRecord3(): SearchRecordV1 {
        return {
            id: '3',
            type: 'Test_type1',
            name: 'Test_name3',
            time: new Date(Date.now()),
            refs: [
                {
                    id: '2',
                    type: 'type2',
                    name: 'name2',
                    parent: false,
                    subtype: 'subtype2'
                }
            ],
            tags: ['green']
        };
    }

    static difference = (arr: any[], ...args: any[]) =>
        arr.filter(item => args.every(arr => !arr.includes(item)));

    static assertEqualSearchRecord(actual: SearchRecordV1, expected: SearchRecordV1) {
        actual = this.fixRecord(actual);
        expected = this.fixRecord(expected);

        assert.isNotNull(actual);
        assert.isNotNull(expected);

        assert.equal(expected.id, actual.id);
        assert.equal(expected.type, actual.type);
        assert.equal(expected.name, actual.name);
        assert.equal(expected.time?.toISOString(), actual.time?.toISOString());
        assert.equal(expected.field1, actual.field1);
        assert.equal(expected.field2, actual.field2);
        assert.equal(expected.field3, actual.field3);
        assert.equal(expected.content, actual.content);

        if (expected.tags != null) {
            assert.isNotNull(actual.tags);
            
            assert.equal(0, this.difference(actual.tags, expected.tags).length);
        }

        if (expected.refs != null) {
            assert.isNotNull(actual.refs);
            assert.equal(actual.refs.length, expected.refs.length);

            for (let index = 0; index < expected.refs.length; index++) {
                const expectedItem = expected.refs[index];

                let actualItem = actual.refs.find((value) => value.id == expectedItem.id);
                assert.isNotNull(actualItem);

                assert.equal(expectedItem.name, actualItem.name);
                assert.equal(expectedItem.parent, actualItem.parent);
                assert.equal(expectedItem.subtype, actualItem.subtype);
                assert.equal(expectedItem.type, actualItem.type);
            }
        }
    }
    
    private static fixRecord(record: SearchRecordV1): SearchRecordV1 {
        if (record == null) return null;

        record.time = DateTimeConverter.toNullableDateTime(record.time);

        return record;

    }
}