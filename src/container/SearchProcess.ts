import { ProcessContainer } from 'pip-services3-container-nodex';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

import {SearchServiceFactory} from '../build/SearchServiceFactory';

export class SearchProcess extends ProcessContainer{
    public constructor(){
        super('service-search', 'Practice records microservice');

        this._factories.add(new SearchServiceFactory());
        this._factories.add(new DefaultRpcFactory());
        this._factories.add(new DefaultSwaggerFactory());
    }
}