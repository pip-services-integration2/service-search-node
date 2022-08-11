import { ObjectSchema } from 'pip-services3-commons-nodex';
import { ArraySchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';

import { ReferenceV1Schema } from './ReferenceV1Schema';

export class SearchRecordV1Schema extends ObjectSchema {    
    public constructor() {
        super();

        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withOptionalProperty('subtype', TypeCode.String);

        this.withOptionalProperty('refs', new ArraySchema(new ReferenceV1Schema()));

        this.withRequiredProperty('name', TypeCode.String);
        this.withOptionalProperty('time', TypeCode.DateTime);
        this.withOptionalProperty('field1', TypeCode.String);
        this.withOptionalProperty('field2', TypeCode.String);
        this.withOptionalProperty('field3', TypeCode.String);
        this.withOptionalProperty('tags', new ArraySchema(TypeCode.String));

        this.withOptionalProperty('content', TypeCode.String);
    }
}
