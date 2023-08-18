import ICurrentUser from "./user.entity";
import { ISprintsData } from "./userWsps.entity";

export interface ITransactionData {
    currentUserSocketId: string,
    currentRoomToken: {
        roomToken: string
    }
}

export interface IPriority {
    value: string;
    color: string | undefined;
}

export interface ITypeHistory {
    value: string;
    label: string;
}

export interface IFilePath {
    name: string;
    relativePath: string;
}

export interface IClockTime {
    recordedTime: number;
    recordedBy: Partial<ICurrentUser>;
    registrationDate: string ;
}
export interface IDataToDo {
    userId: string,
    taskId: string,
    status: string,
    type: ITypeHistory,
    priority: IPriority,
    info: string,
    description: string,
    title: string,
    clockTime: IClockTime[],
    expectedWorkingHours: number,
    createDate: string,
    finishDate?: string,
    file: IFilePath[] | undefined,
}

export interface ITransactionToDo {
    body: Partial<IDataToDo>;
    transactionObject: ITransactionData
}

export interface ITransactionSprint {
    body: Partial<ISprintsData>;
    transactionObject: ITransactionData
}