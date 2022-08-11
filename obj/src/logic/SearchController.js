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
exports.SearchController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const SearchCommandSet_1 = require("./SearchCommandSet");
class SearchController {
    constructor() { }
    configure(config) {
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services3_commons_nodex_1.Descriptor('service-search', 'persistence', '*', '*', '1.0'));
    }
    getCommandSet() {
        if (this._commandSet == null) {
            this._commandSet = new SearchCommandSet_1.SearchCommandSet(this);
        }
        return this._commandSet;
    }
    getRecords(correlationId, filter, paging, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getPageByFilter(correlationId, filter, paging, sort);
        });
    }
    getRecordById(correlationId, recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getOneById(correlationId, recordId);
        });
    }
    setRecord(correlationId, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.create(correlationId, record);
        });
    }
    updateRecord(correlationId, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.update(correlationId, record);
        });
    }
    deleteRecordById(correlationId, recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.deleteById(correlationId, recordId);
        });
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=SearchController.js.map