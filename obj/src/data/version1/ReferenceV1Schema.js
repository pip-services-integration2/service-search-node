"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class ReferenceV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('subtype', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('name', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('parent', pip_services3_commons_nodex_2.TypeCode.Boolean);
    }
}
exports.ReferenceV1Schema = ReferenceV1Schema;
//# sourceMappingURL=ReferenceV1Schema.js.map