import ICurrentUser from "./user.entity";

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
    priority: IPriority,
    info: string,
    description: string,
    title: string,
    clockTime: IClockTime[],
    expectedWorkingHours: number,
    createDate: Date | undefined,
    finishDate?: Date | undefined
    file: IFilePath[] | undefined,
}

export interface ITransactionToDo {
    body: Partial<IDataToDo>;
    transactionObject: ITransactionData
}