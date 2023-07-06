import { ISpreadSheet } from "./spreadsheet.entity";
import { IDataToDo } from "./todo.entity";

export interface IWspUser {
    _id?: string;
    name: string;
    prefix: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData?: IDataToDo[];
    spreadSheetData?: ISpreadSheet
}
