import { IStringIdentifiable } from 'pip-services3-commons-nodex';
import { ReferenceV1 } from './ReferenceV1';
export declare class SearchRecordV1 implements IStringIdentifiable {
    id: string;
    type: string;
    subtype?: string;
    refs?: ReferenceV1[];
    name: string;
    time: Date;
    field1?: string;
    field2?: string;
    field3?: string;
    tags?: string[];
    content?: string;
}
