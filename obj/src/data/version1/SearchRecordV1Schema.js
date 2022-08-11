"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRecordV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const ReferenceV1Schema_1 = require("./ReferenceV1Schema");
class SearchRecordV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_nodex_3.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_nodex_3.TypeCode.String);
        this.withOptionalProperty('subtype', pip_services3_commons_nodex_3.TypeCode.String);
        this.withOptionalProperty('refs', new pip_services3_commons_nodex_2.ArraySchema(new ReferenceV1Schema_1.ReferenceV1Schema()));
        this.withRequiredProperty('name', pip_services3_commons_nodex_3.TypeCode.String);
        this.withOptionalProperty('time', pip_services3_commons_nodex_3.TypeCode.DateTime);
        this.withOptionalProperty('field1', pip_services3_commons_nodex_3.TypeCode.String);
        this.withOptionalProperty('field2', pip_services3_commons_nodex_3.TypeCode.String);
        this.withOptionalProperty('field3', pip_services3_commons_nodex_3.TypeCode.String);
        this.withOptionalProperty('tags', new pip_services3_commons_nodex_2.ArraySchema(pip_services3_commons_nodex_3.TypeCode.String));
        this.withOptionalProperty('content', pip_services3_commons_nodex_3.TypeCode.String);
    }
}
exports.SearchRecordV1Schema = SearchRecordV1Schema;
//# sourceMappingURL=SearchRecordV1Schema.js.map