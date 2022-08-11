import { CommandSet, SortParams } from 'pip-services3-commons-nodex';
import { ISearchController } from '../../src/logic/ISearchController';
export declare class SearchCommandSet extends CommandSet {
    private _controller;
    constructor(controller: ISearchController);
    private makeGetSearchCommand;
    createSortParams(array: any[]): SortParams;
    private makeGetRecordByIdCommand;
    private makeSetRecordCommand;
    private makeUpdateRecordCommand;
    private makeDeleteRecordByIdCommand;
    private fixRecord;
}
