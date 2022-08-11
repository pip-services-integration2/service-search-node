import { ConfigParams } from 'pip-services3-commons-nodex';

import { SearchMemoryPersistence } from '../../src/persistence/SearchMemoryPersistence';
import { SearchPersistenceFixture } from './SearchPersistenceFixture';

suite('SearchMemoryPersistence', () => {
    let persistence: SearchMemoryPersistence;
    let fixture: SearchPersistenceFixture;

    setup(async () => {
        persistence = new SearchMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new SearchPersistenceFixture(persistence);

        await persistence.open(null);
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