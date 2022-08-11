import { FilterParams, IReferences, ConfigParams, SortParams } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IOpenable } from 'pip-services3-commons-nodex';
import { ICleanable } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ISearchPersistence } from './ISearchPersistence';
import { SearchRecordV1 } from '../data/version1';
export declare class SearchElasticPersistence implements ISearchPersistence, IReferenceable, IConfigurable, IOpenable, ICleanable {
    private _connectionResolver;
    private _index;
    private _type;
    private _reconnect;
    private _timeout;
    private _maxRetries;
    private _maxPageSize;
    private _client;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId: string): Promise<void>;
    private createIndexIfNeeded;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId: string): Promise<void>;
    clear(correlationId: string): Promise<void>;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<SearchRecordV1>>;
    getOneById(correlationId: string, id: string): Promise<SearchRecordV1>;
    create(correlationId: string, item: SearchRecordV1): Promise<SearchRecordV1>;
    update(correlationId: string, item: SearchRecordV1): Promise<SearchRecordV1>;
    deleteById(correlationId: string, id: string): Promise<SearchRecordV1>;
    private composeFilter;
    private composeSort;
    private isEmpty;
}
