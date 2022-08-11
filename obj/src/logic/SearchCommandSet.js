"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const SearchRecordV1Schema_1 = require("../data/version1/SearchRecordV1Schema");
class SearchCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(controller) {
        super();
        this._controller = controller;
        this.addCommand(this.makeGetSearchCommand());
        this.addCommand(this.makeGetRecordByIdCommand());
        this.addCommand(this.makeSetRecordCommand());
        this.addCommand(this.makeUpdateRecordCommand());
        this.addCommand(this.makeDeleteRecordByIdCommand());
    }
    makeGetSearchCommand() {
        return new pip_services3_commons_nodex_2.Command('get_records', new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_4.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_5.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_1.FilterParams.fromValue(args.get('filter'));
            let paging = pip_services3_commons_nodex_1.PagingParams.fromValue(args.get('paging'));
            let sort = this.createSortParams(args.get('sort'));
            return yield this._controller.getRecords(correlationId, filter, paging, sort);
        }));
    }
    createSortParams(array) {
        if (array == null)
            return null;
        let sort = new pip_services3_commons_nodex_1.SortParams();
        array.forEach(map => {
            if (map.hasOwnProperty('name') && map.hasOwnProperty('ascending')) {
                let sortField = new pip_services3_commons_nodex_1.SortField();
                sortField.name = pip_services3_commons_nodex_1.StringConverter.toNullableString(map['name']);
                sortField.ascending = pip_services3_commons_nodex_1.BooleanConverter.toBooleanWithDefault(map['ascending'], true);
                if (sortField.name)
                    sort.push(sortField);
            }
        });
        return sort;
    }
    makeGetRecordByIdCommand() {
        return new pip_services3_commons_nodex_2.Command('get_record_by_id', new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('record_id', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recordId = args.getAsString('record_id');
            return yield this._controller.getRecordById(correlationId, recordId);
        }));
    }
    makeSetRecordCommand() {
        return new pip_services3_commons_nodex_2.Command('set_record', new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('record', new SearchRecordV1Schema_1.SearchRecordV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let record = this.fixRecord(args.getAsObject('record'));
            record = yield this._controller.setRecord(correlationId, record);
            return this.fixRecord(record);
        }));
    }
    makeUpdateRecordCommand() {
        return new pip_services3_commons_nodex_2.Command('update_record', new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('record', new SearchRecordV1Schema_1.SearchRecordV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let record = this.fixRecord(args.getAsObject('record'));
            return yield this._controller.updateRecord(correlationId, record);
        }));
    }
    makeDeleteRecordByIdCommand() {
        return new pip_services3_commons_nodex_2.Command('delete_record_by_id', new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('record_id', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recordId = args.getAsString('record_id');
            return yield this._controller.deleteRecordById(correlationId, recordId);
        }));
    }
    fixRecord(record) {
        if (record == null)
            return null;
        record.time = pip_services3_commons_nodex_1.DateTimeConverter.toNullableDateTime(record.time);
        return record;
    }
}
exports.SearchCommandSet = SearchCommandSet;
//# sourceMappingURL=SearchCommandSet.js.map