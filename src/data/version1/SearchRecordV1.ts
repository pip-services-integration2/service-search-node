import { IStringIdentifiable } from 'pip-services3-commons-nodex';
import { ReferenceV1 } from './ReferenceV1';

export class SearchRecordV1 implements IStringIdentifiable {
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