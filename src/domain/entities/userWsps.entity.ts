import { ISpreadSheet } from "./spreadsheet.entity";
import { IDataToDo, ITransactionData } from "./todo.entity";

export interface IAgilePreferences {
    prefix?: string;
    selectedTask: string | null
}

export interface ISpreadSheetPreferences {
    isRowSelectionActive: boolean;
    isMultipleSelectionActive: boolean;
    freezedColumns: number;
}

export interface ICollaborators {
    _id: string;
    name: string;
    role: string;
}

export interface IContainer {
    containerPreferences: IAgilePreferences | ISpreadSheetPreferences;
    wspData?: IDataToDo[];
    spreadSheetData?: ISpreadSheet;
}

export interface IWspUser {
    _id: string;
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    container: IContainer;
    collaborators: ICollaborators[];
}

export interface ITransactionWorkspace {
    body: Partial<IWspUser>,
    transactionObject: ITransactionData
}
