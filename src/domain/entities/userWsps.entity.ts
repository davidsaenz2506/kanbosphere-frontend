import { ISpreadSheet } from "./spreadsheet.entity";
import { IDataToDo } from "./todo.entity";

export interface IWspPreferences {
    selectedTask: string
}

export interface IWspUser {
    _id?: string;
    name: string;
    prefix: string;
    createdDate: Date;
    createdById: string;
    type: string;
    sharedWith: string[];
    wspData?: IDataToDo[];
    wspDataPreferences?: IWspPreferences;
    spreadSheetData?: ISpreadSheet;
}
