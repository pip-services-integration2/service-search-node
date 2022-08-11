# HTTP Protocol (version 1) <br/> Search Microservice

Search microservice implements a HTTP compatible API, that can be accessed on configured port.
All input and output data is serialized in JSON format. Errors are returned in [standard format]().

* [POST /v1/search/get_records](#operationget_records)
* [POST /v1/search/get_record_by_id](#operationget_record_by_id)
* [POST /v1/search/set_record](#operationset_record)
* [POST /v1/search/update_record](#operationupdate_record)
* [POST /v1/search/delete_record_by_id](#operationdelete_record_by_id)

## Operations

### <a name="operation1"></a> Method: 'POST', route '/v1/search/get_records'

Get search records by filter

**Request body:**
- correlation_id: string - id that uniquely identifies transaction
- filter: FilterParams - filter parameters
- paging: PagingParams - paging parameters
- sort: SortParams - sorting params

**Response body:**
- search_record: DataPage<SearchRecordV1> - Page with retrieved search records

### <a name="operation2"></a> Method: 'POST', route '/v1/search/get_record_by_id'

Get search record by id

**Request body:**
- correlation_id: string - id that uniquely identifies transaction
- record_id: string - unique search record id

**Response body:**
- search_record: SearchRecordV1 - finded search record

### <a name="operation3"></a> Method: 'POST', route '/v1/search/set_record'

Add new search record

**Request body:**
- correlation_id: string - id that uniquely identifies transaction
- record: SearchRecordV1 - search record

**Response body:**
- search_record: SearchRecordV1 - generated new search record

### <a name="operation4"></a> Method: 'POST', route '/v1/search/update_record'

Changes search record properties

**Request body:**
- correlation_id: string - id that uniquely identifies transaction
- record: SearchRecordV1 - search record

**Response body:**
- search_record: SearchRecordV1 - updated search record

### <a name="operation5"></a> Method: 'POST', route '/v1/search/delete_record_by_id'

Delete search record by id

**Request body:**
- correlation_id: string - id that uniquely identifies transaction
- record_id: string - unique search record id

**Response body:**
- search_record: SearchRecordV1 - deleted search record

