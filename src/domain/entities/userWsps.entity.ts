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
    isAutoSaveOpen: boolean;
}

export interface ICollaborators {
    _id: string;
    name: string;
    role: string;
    containerPreferences: IAgilePreferences | ISpreadSheetPreferences;
}

export interface ISprintsData {
    sprintId: string;
    sprintPurpose: string;
    sprintDescription: string;
    isSprintActive: boolean;
    sprintStartDate: string | null;
    sprintEndDate: string | null;
    linkedStories: string[];
}

export interface IContainer {
    wspData?: IDataToDo[];
    sprints?: ISprintsData[];
    spreadSheetData?: ISpreadSheet;
}

export interface IWspUser {
    _id: string;
    name: string;
    createdDate: string;
    createdById: string;
    type: string;
    isGoalsModeActive: boolean;
    container: IContainer;
    collaborators: ICollaborators[];
}

export interface ITransactionWorkspace {
    body: Partial<IWspUser>,
    transactionObject: ITransactionData
}
