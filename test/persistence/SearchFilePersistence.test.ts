import { ConfigParams } from 'pip-services3-commons-nodex';

import { SearchFilePersistence } from '../../src/persistence/SearchFilePersistence';
import { SearchPersistenceFixture } from './SearchPersistenceFixture';

suite('SearchFilePersistence', () => {
    let persistence: SearchFilePersistence;
    let fixture: SearchPersistenceFixture;

    setup(async () => {
        persistence = new SearchFilePersistence('data/records.test.json');
        persistence.configure(new ConfigParams());

        fixture = new SearchPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Get with Filters', async () => {
        await fixture.testGetWithFilters();
    });

    test('Sorting', async () => {
        await fixture.testSorting();
    });
});