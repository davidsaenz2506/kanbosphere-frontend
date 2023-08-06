import { ISpreadSheet } from "./spreadsheet.entity";
import { IDataToDo, ITransactionData } from "./todo.entity";

export interface IAgilePreferences {
    selectedTask: string | null
}

export interface ISpreadSheetPreferences {
    isDarkModeOpen: boolean;
    isMultipleSelectionOpen: boolean;
    freezedColumns: number;
}

export interface ICollaborators {
    _id?: string;
    name: string;
    role: string;
}

export interface IWspUser {
    _id?: string;
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    collaborators: ICollaborators[];
    prefix?: string;
    wspData?: IDataToDo[];
    wspDataPreferences?: IAgilePreferences | ISpreadSheetPreferences;
    spreadSheetData?: ISpreadSheet;
}

export interface ITransactionWorkspace {
    body: Partial<IWspUser>,
    transactionObject: ITransactionData
}
