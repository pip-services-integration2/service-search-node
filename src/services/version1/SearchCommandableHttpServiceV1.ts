import { CommandableHttpService } from 'pip-services3-rpc-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

export class SearchCommandableHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/search');
        this._dependencyResolver.put('controller', new Descriptor('service-search', 'controller', '*', '*', '1.0'));
    }
}