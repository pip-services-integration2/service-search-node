import { ConfigParams } from 'pip-services3-commons-nodex';

import { SearchElasticPersistence } from '../../src/persistence/SearchElasticPersistence';
import { SearchPersistenceFixture } from './SearchPersistenceFixture';

suite('SearchElasticPersistence', () => {
    let persistence: SearchElasticPersistence;
    let fixture: SearchPersistenceFixture;

    setup(async () => {
        let host = process.env['ELASTICSEARCH_SERVICE_HOST'] || 'localhost';
        let port = process.env['ELASTICSEARCH_SERVICE_PORT'] || 9200;

        // Exit if elastic connection is not set
        if (host == '')
            return;

        var config = ConfigParams.fromTuples(
            'index', 'search',
            'connection.host', host,
            'connection.port', port
        );

        persistence = new SearchElasticPersistence();
        persistence.configure(config);

        fixture = new SearchPersistenceFixture(persistence, 1000);

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
