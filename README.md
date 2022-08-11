# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Search microservice

This is Search microservice from Pip.Services library. 

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca
* Persistence: Flat Files, MongoDB, Elastic(6.8)

This microservice has no dependencies on other microservices.

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-integration2/client-search-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)

## Contract

Logical contract of the microservice is presented below. 

```typescript
class SearchRecordV1 implements IStringIdentifiable {
    public id: string;
    public type: string;
    public subtype?: string;

    public refs?: ReferenceV1[]; // Reference to document or documents this comment bound to

    public name: string;
    public time: Date;
    public field1?: string;
    public field2?: string;
    public field3?: string;
    public tags?: string[];

    public content?: string;
}

class ReferenceV1 {
    public id: string;
    public type: string;
    public subtype?: string;
    public name?: string;
    public parent?: boolean;
}

interface ISearchV1 {
    getRecords(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>>;

    getRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1>;

    setRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1>;

    updateRecord(correlationId: string, record: SearchRecordV1): Promise<SearchRecordV1>;

    deleteRecordById(correlationId: string, recordId: string): Promise<SearchRecordV1>;}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-integration2/service-search-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 

Example of microservice configuration
```yaml
- descriptor: "pip-services-container:container-info:default:default:1.0"
  name: "service-search"
  description: "search microservice"

- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-search:persistence:file:default:1.0"
  path: "./data/search_records.json"

- descriptor: "service-search:controller:default:default:1.0"

- descriptor: "service-search:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-search-node": "^1.1.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
let sdk = new require('client-search-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
let config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
let client = sdk.SearchHttpClientV1(config);

// Connect to the microservice
await client.open(null);

// Work with the microservice
...
```

Now the client is ready to perform operations
```javascript
// Create a new search record
let record = {
    id: '1',
    type: 'Test_type1',
    name: 'Test_name1',
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

record = await client.setRecord(
    null,
    record
);
```

```javascript
// Get the list of search records
let page = await client.getRecords(
    null,
    {
        type: 'Test_type1',
        name: 'Test_name1'
    },
    {
        total: true,
        skip: 0,
        take: 10
    }
);
```    

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.
